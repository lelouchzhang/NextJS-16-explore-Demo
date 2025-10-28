'use client' // Error boundaries must be Client Components

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        // global-error must include html and body tags
        <html>
            <body>
                <h2>Something went wrong!</h2>
                <button onClick={() => reset()}>Try again</button>
            </body>
        </html>
    )
}

// 可以设计一个全局的错误处理组件，在组件中可以捕获到所有的错误，然后进行统一的处理
// 比如可以将错误信息发送到服务器，也可以将错误信息展示在页面上
// 这样就可以统一的处理错误信息，避免每次都需要在每个页面中都写一遍错误处理的代码
// <ErrorBoundary>