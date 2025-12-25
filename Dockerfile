# 使用 Bun 官方镜像作为基础镜像
FROM node:25-trixie AS base

# 设置工作目录
WORKDIR /app

# 复制 package.json 
COPY package.json  ./
RUN npm install && npm ci --production

# 复制所有源代码
COPY . .

# 构建 Next.js 应用
RUN npm run build

# 生产环境镜像
FROM node:25-trixie AS runner

WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/next.config.ts ./
COPY --from=base /app/public ./public
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static

# 设置正确的权限
RUN chown -R nextjs:nodejs /app

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["./node_modules/next/dist/bin/next", "start"]
