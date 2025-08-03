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
            <img src="/avatar" alt="QQ头像" style="border: 1px solid #ccc;">          </body>
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