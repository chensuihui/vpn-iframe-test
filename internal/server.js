const express=require('express');
const path=require('path');
const app=express();
// 必须替换为实际 GitHub Pages Origin（不含路径和末尾斜杠）
const ENTRY_ORIGIN=process.env.ENTRY_ORIGIN || 'https://chensuihui.github.io/';
app.disable('x-powered-by');
app.use((req,res,next)=>{
  res.setHeader('Content-Security-Policy',`frame-ancestors ${ENTRY_ORIGIN}`);
  res.setHeader('Cache-Control','no-store');
  next();
});
app.get('/result.html',(req,res)=>res.sendFile(path.join(__dirname,'result.html')));
app.get('/api/request-info',(req,res)=>{
  // remoteAddress 为直连对端；反向代理后通常是代理 IP。
  // 仅在可信反向代理正确清洗并设置来源头时才可将其视为真实客户端 IP。
  res.json({remoteAddress:req.socket.remoteAddress,forwardedForUnverified:req.headers['x-forwarded-for']||null,userAgent:req.headers['user-agent']||null,host:req.headers.host,headers:req.headers,time:new Date().toISOString()});
});
app.listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('Listening on '+(process.env.PORT||3000)));
