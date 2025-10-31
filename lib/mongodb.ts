import mongoose, { Connection } from 'mongoose';

// 接口用于缓存 MongoDB 连接
interface MongooseCache {
    conn: Connection | null;
    promise: Promise<Connection> | null;
}

/**
 * 模块级地连接缓存对象
 * 在开发环境中防止热重载时创建多个连接
 */
const mongooseCache: MongooseCache = {
    conn: null, // 操作数据库的实际工作对象
    promise: null, // 实际缓存的构造函数，判断缓存是否需要更新
};

interface MongoDBConfig {
    uri: string;
    options?: mongoose.ConnectOptions;
}
// 准备 MongoDB 配置
function getMongoDBConfig(): MongoDBConfig {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error('请定义 MONGODB_URI 环境变量');
    }

    return {
        uri,
        options: {
            bufferCommands: false, // 禁用缓冲命令
            maxPoolSize: 10, // 最大连接池大小
            serverSelectionTimeoutMS: 5000, // 服务器选择超时时间
            socketTimeoutMS: 45000, // socket 超时时间
        },
    };
}

/**
 * 建立 MongoDB 连接
 * 使用缓存机制防止重复连接
 * 
 * @returns Promise<Connection> MongoDB 的连接实例: conn
 * @throws Error 当连接失败时抛出错误
 */
async function connectToDatabase(): Promise<Connection> {
    // 如果已有缓存的连接，直接返回
    if (mongooseCache.conn) {
        return mongooseCache.conn;
    }

    // 如果已有正在进行的连接 Promise，等待它完成
    if (mongooseCache.promise) {
        return mongooseCache.promise;
    }

    // 否则，创建新的连接 Promise
    mongooseCache.promise = (async () => {
        try {
            const config = getMongoDBConfig();

            console.log('正在连接到 MongoDB...');

            await mongoose.connect(config.uri, config.options);
            // 获取连接实例
            const conn = mongoose.connection;

            // 设置连接事件监听器
            conn.on('error', (error) => {
                console.error('MongoDB 连接错误:', error);
                // 发生错误时清除缓存，允许重新连接
                mongooseCache.conn = null;
                mongooseCache.promise = null;
            });

            conn.on('disconnected', () => {
                console.log('MongoDB 连接断开');
                mongooseCache.conn = null;
                mongooseCache.promise = null;
            });

            conn.on('connected', () => {
                console.log('MongoDB 连接成功');
            });

            // 缓存连接实例
            mongooseCache.conn = conn;

            return conn;
        } catch (error) {
            // 连接失败时清除缓存
            mongooseCache.promise = null;
            console.error('MongoDB 连接失败:', error);
            throw error;
        }
    })();

    return mongooseCache.promise;
}

/**
 * 安全地关闭 MongoDB 连接
 * 用于应用关闭时清理资源
 */
async function disconnectFromDatabase(): Promise<void> {
    if (mongooseCache.conn) {
        try {
            await mongoose.disconnect();
            console.log('MongoDB 连接已关闭');
        } catch (error) {
            console.error('关闭 MongoDB 连接时出错:', error);
        } finally {
            // 无论成功与否都清除缓存
            mongooseCache.conn = null;
            mongooseCache.promise = null;
        }
    }
}

/**
 * 检查当前连接状态
 * 
 * @returns 连接状态信息
 */
function getConnectionStatus(): {
    isConnected: boolean;
    readyState: number;
    host?: string;
    name?: string;
} {
    if (mongooseCache.conn) {
        return {
            isConnected: mongooseCache.conn.readyState === 1,
            readyState: mongooseCache.conn.readyState,
            host: mongooseCache.conn.host,
            name: mongooseCache.conn.name,
        };
    }

    return {
        isConnected: false,
        readyState: 0, // 0 = disconnected
    };
}

// 导出主要功能
export {
    connectToDatabase,
    disconnectFromDatabase,
    getConnectionStatus,
    mongoose,
};

export default connectToDatabase;