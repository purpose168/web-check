# 指定要使用的 Node.js 版本
ARG NODE_VERSION=21

# 指定要使用的 Debian 版本，默认为 "bullseye"
ARG DEBIAN_VERSION=bullseye

# 使用 Node.js Docker 镜像作为基础镜像，指定特定的 Node.js 和 Debian 版本
FROM node:${NODE_VERSION}-${DEBIAN_VERSION} AS build

# 设置容器的默认 shell 为 Bash 并启用一些选项
# -e: 如果命令失败则立即退出
# -u: 使用未定义的变量时视为错误
# -o pipefail: 管道命令中任何一个失败则整个管道失败
# -c: 从字符串中读取并执行命令
SHELL ["/bin/bash", "-euo", "pipefail", "-c"]

# 安装 Chromium 浏览器，下载并验证 Google Chrome 的签名密钥
RUN apt-get update -qq --fix-missing && \
    apt-get -qqy install --allow-unauthenticated gnupg wget && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
    apt-get update -qq && \
    apt-get -qqy --no-install-recommends install chromium traceroute python make g++ && \
    rm -rf /var/lib/apt/lists/* 

# 运行 Chromium 浏览器的版本命令并将其输出重定向到 /etc/chromium-version 文件
RUN /usr/bin/chromium --no-sandbox --version > /etc/chromium-version

# 设置工作目录为 /app
WORKDIR /app

# 将 package.json 和 yarn.lock 复制到工作目录
COPY package.json yarn.lock ./

# 运行 yarn install 安装依赖并清除 yarn 缓存
# --frozen-lockfile: 使用 yarn.lock 中的确切版本，不更新
# --network-timeout 100000: 设置网络超时时间为 100 秒
RUN apt-get update && \
    yarn install --frozen-lockfile --network-timeout 100000 && \
    rm -rf /app/node_modules/.cache

# 将所有文件复制到工作目录
COPY . .

# 运行 yarn build 构建应用程序
# --production: 以生产模式构建
RUN yarn build --production

# 最终阶段
FROM node:${NODE_VERSION}-${DEBIAN_VERSION}  AS final

# 设置工作目录为 /app
WORKDIR /app

# 复制 package.json 和 yarn.lock 到工作目录
COPY package.json yarn.lock ./
# 从构建阶段复制构建好的文件到工作目录
COPY --from=build /app .

# 安装运行时所需的依赖
# 只安装 Chromium 和 traceroute，不安装构建工具（如 make、g++）
# chmod 755: 确保 Chromium 可执行文件具有正确的执行权限
RUN apt-get update && \
    apt-get install -y --no-install-recommends chromium traceroute && \
    chmod 755 /usr/bin/chromium && \
    rm -rf /var/lib/apt/lists/* /app/node_modules/.cache

# 暴露容器端口，默认为 3000，可通过环境变量 PORT 修改
EXPOSE ${PORT:-3000}

# 设置环境变量 CHROME_PATH 以指定 Chromium 二进制文件的路径
ENV CHROME_PATH='/usr/bin/chromium'

# 定义容器启动时执行的命令，启动 Node.js 应用程序的 server.js
CMD ["yarn", "start"]
