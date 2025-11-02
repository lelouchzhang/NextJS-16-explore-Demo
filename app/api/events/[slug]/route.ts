import { Event } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import logger from "@/config/logger";

/**
 * GET /api/events/[slug]
 * 根据slug获取单个event详情
 */
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
    const startTime = Date.now();
    const { slug } = await params;

    try {
        // 记录请求开始
        logger.info('获取单个event API请求开始', {
            method: 'GET',
            url: `/api/events/${slug}`,
            slug,
            timestamp: new Date().toISOString()
        });

        // 验证slug参数
        if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
            logger.warn('无效的slug参数', { slug });
            return NextResponse.json(
                { message: "无效的slug参数" },
                { status: 400 }
            );
        }

        const normalizedSlug = slug.trim().toLowerCase();

        // 连接数据库
        logger.info('正在连接数据库...');
        await connectToDatabase();
        logger.info('数据库连接成功');

        // 查询事件
        logger.info('正在查询事件...', { slug: normalizedSlug });
        const event = await Event.findOne({ slug: normalizedSlug });

        // 检查事件是否存在
        if (!event) {
            logger.warn('事件未找到', { slug: normalizedSlug });
            return NextResponse.json(
                { message: "事件未找到" },
                { status: 404 }
            );
        }

        // 转换Mongoose文档为普通对象，移除内部属性
        const eventData = {
            _id: event._id.toString(),
            title: event.title,
            slug: event.slug,
            description: event.description,
            overview: event.overview,
            image: event.image,
            venue: event.venue,
            location: event.location,
            date: event.date,
            time: event.time,
            mode: event.mode,
            audience: event.audience,
            agenda: event.agenda,
            organizer: event.organizer,
            tags: event.tags,
            createdAt: event.createdAt.toISOString(),
            updatedAt: event.updatedAt.toISOString()
        };

        const responseTime = Date.now() - startTime;
        logger.info('获取单个event API请求成功', {
            status: 200,
            responseTime: `${responseTime}ms`,
            eventId: event._id.toString(),
            title: event.title
        });

        return NextResponse.json({
            message: "事件获取成功",
            data: eventData
        }, { status: 200 });

    } catch (error) {
        const responseTime = Date.now() - startTime;

        logger.error('获取单个event API请求失败', {
            error: error instanceof Error ? error.message : '未知错误',
            stack: error instanceof Error ? error.stack : undefined,
            responseTime: `${responseTime}ms`,
            status: 500,
            slug
        });

        return NextResponse.json({
            message: error instanceof Error ? error.message : "服务器内部错误"
        }, { status: 500 });
    }
}

/**
 * PUT /api/events/[slug]
 * 根据slug更新event
 */
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
    const startTime = Date.now();
    const { slug } = await params;

    try {
        logger.info('更新event API请求开始', {
            method: 'PUT',
            url: `/api/events/${slug}`,
            slug,
            timestamp: new Date().toISOString()
        });

        // 验证slug参数
        if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
            logger.warn('无效的slug参数', { slug });
            return NextResponse.json(
                { message: "无效的slug参数" },
                { status: 400 }
            );
        }

        const normalizedSlug = slug.trim().toLowerCase();

        // 解析请求体
        let updateData;
        try {
            updateData = await req.json();
            logger.debug('解析请求体成功', { updateKeys: Object.keys(updateData) });
        } catch (error) {
            logger.error('解析请求体失败', { error: error instanceof Error ? error.message : '未知错误' });
            return NextResponse.json(
                { message: "无效的JSON数据" },
                { status: 400 }
            );
        }

        // 连接数据库
        logger.info('正在连接数据库...');
        await connectToDatabase();
        logger.info('数据库连接成功');

        // 查询并更新事件
        logger.info('正在更新事件...', { slug: normalizedSlug });
        const updatedEvent = await Event.findOneAndUpdate(
            { slug: normalizedSlug },
            updateData,
            {
                new: true, // 返回更新后的文档
                runValidators: true // 运行模型验证
            }
        );

        // 检查事件是否存在
        if (!updatedEvent) {
            logger.warn('事件未找到，无法更新', { slug: normalizedSlug });
            return NextResponse.json(
                { message: "事件未找到" },
                { status: 404 }
            );
        }

        const responseTime = Date.now() - startTime;
        logger.info('更新event API请求成功', {
            status: 200,
            responseTime: `${responseTime}ms`,
            eventId: updatedEvent._id.toString(),
            title: updatedEvent.title
        });

        return NextResponse.json({
            message: "事件更新成功",
            data: {
                _id: updatedEvent._id.toString(),
                title: updatedEvent.title,
                slug: updatedEvent.slug
            }
        }, { status: 200 });

    } catch (error) {
        const responseTime = Date.now() - startTime;

        logger.error('更新event API请求失败', {
            error: error instanceof Error ? error.message : '未知错误',
            stack: error instanceof Error ? error.stack : undefined,
            responseTime: `${responseTime}ms`,
            status: 500,
            slug
        });

        return NextResponse.json({
            message: error instanceof Error ? error.message : "服务器内部错误"
        }, { status: 500 });
    }
}

/**
 * DELETE /api/events/[slug]
 * 根据slug删除event
 */
export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
    const startTime = Date.now();
    const { slug } = await params;

    try {
        logger.info('删除event API请求开始', {
            method: 'DELETE',
            url: `/api/events/${slug}`,
            slug,
            timestamp: new Date().toISOString()
        });

        // 验证slug参数
        if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
            logger.warn('无效的slug参数', { slug });
            return NextResponse.json(
                { message: "无效的slug参数" },
                { status: 400 }
            );
        }

        const normalizedSlug = slug.trim().toLowerCase();

        // 连接数据库
        logger.info('正在连接数据库...');
        await connectToDatabase();
        logger.info('数据库连接成功');

        // 查询并删除事件
        logger.info('正在删除事件...', { slug: normalizedSlug });
        const deletedEvent = await Event.findOneAndDelete({ slug: normalizedSlug });

        // 检查事件是否存在
        if (!deletedEvent) {
            logger.warn('事件未找到，无法删除', { slug: normalizedSlug });
            return NextResponse.json(
                { message: "事件未找到" },
                { status: 404 }
            );
        }

        const responseTime = Date.now() - startTime;
        logger.info('删除event API请求成功', {
            status: 200,
            responseTime: `${responseTime}ms`,
            eventId: deletedEvent._id.toString(),
            title: deletedEvent.title
        });

        return NextResponse.json({
            message: "事件删除成功",
            data: {
                _id: deletedEvent._id.toString(),
                title: deletedEvent.title,
                slug: deletedEvent.slug
            }
        }, { status: 200 });

    } catch (error) {
        const responseTime = Date.now() - startTime;

        logger.error('删除event API请求失败', {
            error: error instanceof Error ? error.message : '未知错误',
            stack: error instanceof Error ? error.stack : undefined,
            responseTime: `${responseTime}ms`,
            status: 500,
            slug
        });

        return NextResponse.json({
            message: error instanceof Error ? error.message : "服务器内部错误"
        }, { status: 500 });
    }
}