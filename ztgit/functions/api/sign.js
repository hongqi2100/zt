import crypto from 'node:crypto'

const KEYS = {
  professional: process.env.PRIVATE_KEY_PRO,
  premium:      process.env.PRIVATE_KEY_PREMIUM
}

export async function onRequestPost(context) {
  const { uid, validity, version } = await context.request.json()
  if (!uid || !validity || !KEYS[version])
    return new Response('参数缺失或版本错误', { status: 400 })

  const activateTime = new Date().toLocaleString('zh-CN')
  const limit        = /^\d+$/.test(validity) ? `${validity}天` : '永久'
  const str2sign     = `${uid}/${activateTime}/${limit}`

  const signer = crypto.createSign('RSA-SHA384')
  signer.update(str2sign)
  const signature = signer.sign(KEYS[version], 'base64')

  return Response.json({
    "激活时间": activateTime,
    "有效期限": limit,
    "数字签名": signature
  })
}