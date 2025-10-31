import { Event } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import logger from "@/config/logger";

import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
    const startTime = Date.now();

    try {
        // 记录请求开始
        logger.info('API请求开始', {
            method: 'POST',
            url: '/api/events',
            timestamp: new Date().toISOString()
        });

        let event;
        const formData = await req.formData()

        // 记录表单数据接收
        logger.debug('接收到表单数据', {
            formDataCount: Array.from(formData.entries()).length
        });

        // 数据库连接
        logger.info('正在连接数据库...');
        await connectToDatabase()
        logger.info('数据库连接成功');

        try {
            event = Object.fromEntries(formData.entries())
            logger.info('表单数据格式化成功', {
                eventKeys: Object.keys(event)
            });
        } catch (error) {
            logger.error('表单数据格式化失败', {
                error: error instanceof Error ? error.message : '未知错误',
                stack: error instanceof Error ? error.stack : undefined
            });
            return NextResponse.json({
                message: "格式化表单数据时失败"
            }, { status: 400 })
        }

        // 图片上传
        logger.info('正在上传图片...');
        const image = formData.get('image') as File
        if (!image) return NextResponse.json({ message: "请上传图片" }, { status: 400 })

        const arrayBuffer = await image.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: "image", folder: "DevEvents" }, (error, results) => {
                if (error) reject(error)

                else resolve(results)
            }).end(buffer)
        })

        event.image = (uploadResult as { secure_url: string }).secure_url
        logger.info('图片上传成功', {
            imageUrl: event.image
        });

        // 创建事件记录
        logger.info('正在创建事件记录...');
        const eventCreated = await Event.create(event)
        logger.info('事件记录创建成功', {
            eventId: eventCreated._id,
            eventType: event.type || 'unknown'
        });

        const responseTime = Date.now() - startTime;
        logger.info('API请求完成', {
            status: 201,
            responseTime: `${responseTime}ms`
        });

        return NextResponse.json({
            message: "event创建成功"
        }, { status: 201 })
    } catch (error) {
        const responseTime = Date.now() - startTime;
        logger.error('API请求失败', {
            error: error instanceof Error ? error.message : '未知错误',
            stack: error instanceof Error ? error.stack : undefined,
            responseTime: `${responseTime}ms`,
            status: 500
        });

        return NextResponse.json({
            message: error instanceof Error ? error.message : "未知的服务器错误"
        }, { status: 500 })
    }
}

export async function GET() {
    const startTime = Date.now();
    try {
        await connectToDatabase()
        const events = await Event.find().sort({ createdAt: -1 })
        return NextResponse.json({
            message: "event获取成功"
        }, { status: 200 })
    } catch (error) {
        const responseTime = Date.now() - startTime;
        logger.error("GET请求全部event数据时失败", {
            error: error instanceof Error ? error.message : "未知错误",
            responseTime: `${responseTime}ms`,
            status: 500
        })
        return NextResponse.json({
            message: error instanceof Error ? error.message : "未知的服务器错误"
        }, { status: 500 })
    }
}