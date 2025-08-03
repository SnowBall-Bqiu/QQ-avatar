// Cloudflare Workers 反向代理 QQ 头像
// QQ号从环境变量中获取

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
    // 从环境变量获取QQ号
    const qqNumber = QQ_NUMBER || '10000' // 默认QQ号
    
    // 解析请求URL
    const url = new URL(request.url)
    const pathname = url.pathname
    
    // 如果访问根路径，返回使用说明
    if (pathname === '/') {
      return new Response(`
        <html>
          <head>
            <title>QQ头像代理服务</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1>QQ头像代理服务</h1>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
              <a href="https://github.com/SnowBall-Bqiu/QQ-avatar" target="_blank" style="display: flex; align-items: center; text-decoration: none; padding: 8px 16px; background: #24292e; color: white; border-radius: 6px; font-size: 14px;">
                <svg height="20" width="20" style="margin-right: 8px;" viewBox="0 0 16 16" fill="white">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                GitHub
              </a>
            </div>
            <p>访问路径:</p>
            <ul>
              <li><code>/avatar</code> - 获取默认大小头像 (100x100)</li>
              <li><code>/avatar/40</code> - 获取40x40头像</li>
              <li><code>/avatar/100</code> - 获取100x100头像</li>
              <li><code>/avatar/640</code> - 获取640x640头像</li>
            </ul>
            <p>默认大小头像（100x100）: <a href="/avatar">/avatar</a></p>
            <p>40x40头像: <a href="/avatar/40">/avatar/40</a></p>
            <p>100x100头像: <a href="/avatar/100">/avatar/100</a></p>
            <p>640x640头像: <a href="/avatar/640">/avatar/640</a></p>
            <h3>目前配置的QQ号的头像</h3>
            <img src="/avatar" alt="QQ头像" style="border: 1px solid #ccc;">
            </body>
        </html>
      `, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }
    
    // 处理头像请求
    if (pathname.startsWith('/avatar')) {
      // 解析头像大小
      let size = '100' // 默认大小
      const pathParts = pathname.split('/')
      if (pathParts.length > 2 && pathParts[2]) {
        const requestedSize = pathParts[2]
        // 验证大小参数
        if (['40', '100', '640'].includes(requestedSize)) {
          size = requestedSize
        }
      }
      
      // 构建QQ头像URL
      const avatarUrl = `https://q1.qlogo.cn/g?b=qq&nk=${qqNumber}&s=${size}`
      
      // 发起请求到QQ头像服务器
      const response = await fetch(avatarUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://qzone.qq.com/'
        }
      })
      
      // 检查响应状态
      if (!response.ok) {
        return new Response('头像获取失败', { 
          status: 404,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Access-Control-Allow-Origin': '*'
          }
        })
      }
      
      // 创建新的响应，添加CORS头
      const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
          'Cache-Control': 'public, max-age=3600', // 缓存1小时
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      })
      
      return newResponse
    }
    
    // 处理OPTIONS请求（CORS预检）
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      })
    }
    
    // 其他路径返回404
    return new Response('页面未找到', { 
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    })
    
  } catch (error) {
    console.error('处理请求时发生错误:', error)
    return new Response('服务器内部错误', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}