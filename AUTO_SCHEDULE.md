# 自动化发布 — 定时任务配置

## 安装依赖（只需一次）
```
cd C:\Users\fushu\Documents\trae_projects\cnitnews
npm install node-cron
```

## 定时任务（Windows 任务计划程序）

每6小时运行一次，自动扒IT之家最新文章并发布。

运行命令：
```
C:\Program Files\nodejs\node.exe C:\Users\fushu\Documents\trae_projects\cnitnews\auto-publisher.js
```
