import { Schema, model, models, Document } from 'mongoose';

// TypeScript interface for Event document
export interface IEvent extends Document {
    title: string;
    slug: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode: string;
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
        },
        overview: {
            type: String,
            required: [true, 'Overview is required'],
            trim: true,
            maxlength: [500, 'Overview cannot exceed 500 characters'],
        },
        image: {
            type: String,
            required: [true, 'Image URL is required'],
            trim: true,
        },
        venue: {
            type: String,
            required: [true, 'Venue is required'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        date: {
            type: String,
            required: [true, 'Date is required'],
        },
        time: {
            type: String,
            required: [true, 'Time is required'],
        },
        mode: {
            type: String,
            required: [true, 'Mode is required'],
            enum: {
                values: ['online', 'offline', 'hybrid'],
                message: 'Mode must be either online, offline, or hybrid',
            },
        },
        audience: {
            type: String,
            required: [true, 'Audience is required'],
            trim: true,
        },
        agenda: {
            type: [String],
            required: [true, 'Agenda is required'],
            validate: {
                validator: (v: string[]) => v.length > 0,
                message: 'At least one agenda item is required',
            },
        },
        organizer: {
            type: String,
            required: [true, 'Organizer is required'],
            trim: true,
        },
        tags: {
            type: [String],
            required: [true, 'Tags are required'],
            validate: {
                validator: (v: string[]) => v.length > 0,
                message: 'At least one tag is required',
            },
        },
    },
    {
        timestamps: true, // Auto-generate createdAt and updatedAt
    }
);

// 中间件pre('save')，event增改时的预检
// 如event.save() 、 Event.create() 、 Event.findByIdAndUpdate()
EventSchema.pre('save', function (next) {
    const event = this as IEvent;

    // Slug仅在新建或Event标题被修改时生成
    if (event.isModified('title') || event.isNew) {
        event.slug = generateSlug(event.title);
    }

    // data增改时的格式化
    if (event.isModified('date')) {
        event.date = normalizeDate(event.date);
    }

    // 时分秒增改时的格式化 (HH:MM)
    if (event.isModified('time')) {
        event.time = normalizeTime(event.time);
    }

    next();
});

// Helper function to generate URL-friendly slug
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Helper function to normalize date to ISO format
function normalizeDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
    }
    return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
}

// Helper function to normalize time format
function normalizeTime(timeString: string): string {
    // Handle various time formats and convert to HH:MM (24-hour format)
    const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
    const match = timeString.trim().match(timeRegex);

    if (!match) {
        throw new Error('Invalid time format. Use HH:MM or HH:MM AM/PM');
    }

    let hours = parseInt(match[1]);
    const minutes = match[2];
    const period = match[4]?.toUpperCase();

    if (period) {
        // Convert 12-hour to 24-hour format
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
    }

    if (hours < 0 || hours > 23 || parseInt(minutes) < 0 || parseInt(minutes) > 59) {
        throw new Error('Invalid time values');
    }

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}


// 针对常见查询场景：按日期和模式筛选事件的复合索引
// 例如：查询"2025-10-30的所有线上活动"
EventSchema.index({ date: 1, mode: 1 });

// models init_if_needed 会直接注册到mongoose上，自动连接（所有模型共享同一个 mongoose.connection）
/**
 * 1. mongoose.connect() 建立全局连接
 * 2. model() 将 Schema 注册到全局 Mongoose 实例
 * 3. 模型操作自动路由到当前连接
 * 4. 连接状态由conn.on('connected',fn)监听，但数据通信不经过事件触发来实现。
 */
const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;