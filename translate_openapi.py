#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OpenAPI 规范文件中文注释添加脚本
功能：为 OpenAPI YAML 文件添加详细的中文注释和说明
"""

import re
import sys

def translate_openapi_spec(input_file, output_file):
    """
    翻译 OpenAPI 规范文件
    为 YAML 文件添加中文注释和翻译
    
    参数:
        input_file: 输入文件路径
        output_file: 输出文件路径
    """
    
    # 读取输入文件
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 添加文件开头的注释
    file_header = """# OpenAPI 规范文件
# 本文件定义了 Web Check API 的所有端点、参数、响应和数据模型
# OpenAPI 规范（原 Swagger 规范）是一种用于描述 REST API 的标准格式
# 版本 3.0.0 提供了完整的 API 文档，包括请求/响应格式、认证方式等

"""
    
    # 在文件开头添加注释
    content = file_header + content
    
    # 翻译和添加注释的规则字典
    # 格式: (匹配模式, 替换内容)
    replacements = [
        # OpenAPI 版本
        (r'^(openapi:\s*3\.0\.0)$', r'# OpenAPI 规范版本\n# OpenAPI 规范（原 Swagger 规范）是一种用于描述 REST API 的标准格式\n# 版本 3.0.0 是当前主要版本，提供了比 2.0 版本更强大的功能\n\1'),
        
        # info 部分
        (r'^(info:)$', r'# API 信息部分\n\1'),
        (r'^(  title: Web Check 🕵)$', r'# API 标题\n\1'),
        (r'^(  description: >)$', r'# API 描述\n\1'),
        (r'^(\*\*API documentation for the \[Web Check\]\(https://github\.com/lissy93/web-check\) backend endpoints\.\*\*<br>)$', r'**[Web Check](https://github.com/lissy93/web-check) 后端端点的 API 文档。**<br>'),
        (r'^(_Web Check gives you x-ray vision, revealing the configration and inner workings of any website\._)$', r'_Web Check 为您提供 X 射线般的视野，揭示任何网站的配置和内部工作原理。_'),
        (r'^(  version: 1\.0\.0)$', r'# API 版本\n\1'),
        (r'^(  license:)$', r'# 许可证信息\n\1'),
        (r'^(    name: \'License: MIT\')$', r'# 许可证名称：MIT 开源许可证\n\1'),
        (r'^(    url: https://github\.com/Lissy93/web-check/blob/master/LICENSE)$', r'# 许可证详细信息的 URL\n\1'),
        (r'^(  termsOfService: https://web-check\.xyz/about#terms-info)$', r'# 服务条款 URL\n\1'),
        
        # externalDocs 部分
        (r'^(externalDocs:)$', r'# 外部文档\n\1'),
        (r'^(  description: \'Source: GitHub\')$', r'# 外部文档描述：源代码在 GitHub\n\1'),
        (r'^(  url: https://github\.com/lissy93/web-check)$', r'# 外部文档的 URL\n\1'),
        
        # servers 部分
        (r'^(servers:)$', r'# 服务器配置\n# 定义 API 可用的服务器端点\n\1'),
        (r'^(  - url: http://localhost:3001/api)$', r'# 本地开发服务器\n\1'),
        (r'^(    description: Local \(Development\))$', r'# 服务器描述：本地开发环境\n\1'),
        (r'^(  - url: http://localhost:3000/api)$', r'# 本地生产服务器\n\1'),
        (r'^(    description: Local \(Production\))$', r'# 服务器描述：本地生产环境\n\1'),
        (r'^(  - url: https://web-check\.xyz/api)$', r'# Vercel 部署的公共演示服务器\n\1'),
        (r'^(    description: Public Demo \(Vercel\))$', r'# 服务器描述：Vercel 部署的公共演示\n\1'),
        (r'^(  - url: https://web-check\.as93\.net/api)$', r'# Netlify 部署的公共演示服务器\n\1'),
        (r'^(    description: Public Demo \(Netlify\))$', r'# 服务器描述：Netlify 部署的公共演示\n\1'),
        
        # tags 部分
        (r'^(tags:)$', r'# API 标签\n# 用于对 API 端点进行分类和组织\n\1'),
        (r'^(  - name: Quality & Info)$', r'# 质量与信息标签\n\1'),
        (r'^(    description: Endpoints providing quality metrics, and general website information\.)$', r'# 标签描述：提供质量指标和一般网站信息的端点\n\1'),
        (r'^(  - name: Security)$', r'# 安全标签\n\1'),
        (r'^(    description: Endpoints related to website and server security configurations\.)$', r'# 标签描述：与网站和服务器安全配置相关的端点\n\1'),
        (r'^(  - name: Server Info)$', r'# 服务器信息标签\n\1'),
        (r'^(    description: Endpoints providing information about the server hosting the website\.)$', r'# 标签描述：提供托管网站的服务器信息的端点\n\1'),
        (r'^(  - name: Client-Side Information)$', r'# 客户端信息标签\n\1'),
        (r'^(    description: Endpoints providing metrics about the website\'s client-side content\.)$', r'# 标签描述：提供网站客户端内容指标的端点\n\1'),
        
        # components 部分
        (r'^(components:)$', r'# 组件定义\n# 定义可重用的组件，如响应、参数、模式等\n\1'),
        (r'^(  responses:)$', r'# 响应组件\n# 定义可重用的响应模板\n\1'),
        (r'^(    Error:)$', r'# 错误响应\n\1'),
        (r'^(      description: Internal Server Error - An error occurred while processing the request\.)$', r'# 内部服务器错误 - 处理请求时发生错误\n\1'),
        (r'^(    Skipped:)$', r'# 跳过响应\n\1'),
        (r'^(      description: No Content - The request was successful, but no content is returned\.)$', r'# 无内容 - 请求成功，但没有返回内容\n\1'),
        (r'^(    MissingParam:)$', r'# 缺少参数响应\n\1'),
        (r'^(      description: Bad Request - Missing or incorrect input parameters\.)$', r'# 错误请求 - 缺少或错误的输入参数\n\1'),
        (r'^(    Unauthorized:)$', r'# 未授权响应\n\1'),
        (r'^(      description: Unauthorized - Authentication credentials were missing or incorrect\.)$', r'# 未授权 - 身份验证凭据缺失或错误\n\1'),
        (r'^(    Forbidden:)$', r'# 禁止访问响应\n\1'),
        (r'^(      description: Forbidden - The credentials provided do not grant the necessary permissions\.)$', r'# 禁止访问 - 提供的凭据不授予必要的权限\n\1'),
        (r'^(    TooManyRequests:)$', r'# 请求过多响应\n\1'),
        (r'^(      description: Too Many Requests - Rate limit exceeded\.)$', r'# 请求过多 - 超过速率限制\n\1'),
        
        # schemas 部分
        (r'^(  schemas:)$', r'# 数据模式（Schemas）\n# 定义可重用的数据模型\n\1'),
        (r'^(    ErrorResponse:)$', r'# 错误响应模式\n\1'),
        (r'^(      type: object)$', r'# 数据类型：对象\n\1'),
        (r'^(      properties:)$', r'# 对象属性\n\1'),
        (r'^(        error:)$', r'# 错误信息\n\1'),
        (r'^(          type: string)$', r'# 数据类型：字符串\n\1'),
        (r'^(          description: A description of the error)$', r'# 错误描述\n\1'),
        (r'^(    SkippedResponse:)$', r'# 跳过响应模式\n\1'),
        (r'^(        skipped:)$', r'# 跳过原因\n\1'),
        (r'^(          description: A description of why the check was skipped)$', r'# 检查被跳过的原因描述\n\1'),
        
        # paths 部分
        (r'^(paths:)$', r'# API 路径（端点）\n# 定义所有 API 端点的路径、方法、参数和响应\n\1'),
        
        # /archives 端点
        (r'^(  /archives:)$', r'# 归档数据端点\n# 获取网站的历史归档信息（来自 Wayback Machine）\n\1'),
        (r'^(    get:)$', r'# GET 方法\n\1'),
        (r'^(      summary: Retrieve archive data)$', r'# 摘要：获取归档数据\n\1'),
        (r'^(      tags:)$', r'# 标签\n\1'),
        (r'^(        - Quality & Info)$', r'# 归类到"质量与信息"标签\n\1'),
        (r'^(      parameters:)$', r'# 请求参数\n\1'),
        (r'^(        - name: url)$', r'# URL 参数\n\1'),
        (r'^(          in: query)$', r'# 参数位置：查询字符串\n\1'),
        (r'^(          required: true)$', r'# 是否必需：是\n\1'),
        (r'^(          description: The URL to fetch results about)$', r'# 要获取结果的 URL\n\1'),
        (r'^(          schema:)$', r'# 参数模式\n\1'),
        (r'^(            type: string)$', r'# 数据类型：字符串\n\1'),
        (r'^(      responses:)$', r'# 响应定义\n\1'),
        (r"^(        '200':)$", r"# HTTP 200 响应 - 成功\n\1"),
        (r'^(          description: Successful response)$', r'# 响应描述：成功\n\1'),
        (r'^(          content:)$', r'# 响应内容\n\1'),
        (r'^(            application/json:)$', r'# 内容类型：JSON\n\1'),
        (r'^(              schema:)$', r'# 响应模式\n\1'),
        (r'^(                type: object)$', r'# 数据类型：对象\n\1'),
        (r'^(                properties:)$', r'# 响应属性\n\1'),
        (r'^(                  firstScan:)$', r'# 首次扫描时间\n\1'),
        (r'^(                    type: string)$', r'# 数据类型：字符串\n\1'),
        (r'^(                    format: date-time)$', r'# 格式：日期时间\n\1'),
        (r'^(                    description: The timestamp of the first scan)$', r'# 首次扫描的时间戳\n\1'),
        (r'^(                  lastScan:)$', r'# 最后扫描时间\n\1'),
        (r'^(                    description: The timestamp of the last scan)$', r'# 最后扫描的时间戳\n\1'),
        (r'^(                  totalScans:)$', r'# 总扫描次数\n\1'),
        (r'^(                    type: integer)$', r'# 数据类型：整数\n\1'),
        (r'^(                    description: The total number of scans)$', r'# 总扫描次数\n\1'),
        (r'^(                  changeCount:)$', r'# 变更次数\n\1'),
        (r'^(                    description: The total number of changes)$', r'# 总变更次数\n\1'),
        (r'^(                  averagePageSize:)$', r'# 平均页面大小\n\1'),
        (r'^(                    description: The average page size in KB)$', r'# 平均页面大小（KB）\n\1'),
        (r'^(                  scanFrequency:)$', r'# 扫描频率\n\1'),
        (r'^(                    type: object)$', r'# 数据类型：对象\n\1'),
        (r'^(                    properties:)$', r'# 扫描频率属性\n\1'),
        (r'^(                      daysBetweenScans:)$', r'# 扫描间隔天数\n\1'),
        (r'^(                        type: number)$', r'# 数据类型：数字\n\1'),
        (r'^(                        format: float)$', r'# 格式：浮点数\n\1'),
        (r'^(                        description: Average days between scans)$', r'# 平均扫描间隔天数\n\1'),
        (r'^(                      daysBetweenChanges:)$', r'# 变更间隔天数\n\1'),
        (r'^(                        description: Average days between changes)$', r'# 平均变更间隔天数\n\1'),
        (r'^(                      scansPerDay:)$', r'# 每日扫描次数\n\1'),
        (r'^(                        description: Number of scans per day)$', r'# 每天扫描次数\n\1'),
        (r'^(                      changesPerDay:)$', r'# 每日变更次数\n\1'),
        (r'^(                        description: Number of changes per day)$', r'# 每天变更次数\n\1'),
        (r'^(                  scans:)$', r'# 扫描详情列表\n\1'),
        (r'^(                    type: array)$', r'# 数据类型：数组\n\1'),
        (r'^(                    items:)$', r'# 数组项\n\1'),
        (r'^(                      type: array)$', r'# 数据类型：数组\n\1'),
        (r'^(                      items:)$', r'# 嵌套数组项\n\1'),
        (r'^(                        type: string)$', r'# 数据类型：字符串\n\1'),
        (r'^(                      description: List of scan details)$', r'# 扫描详情列表\n\1'),
        (r'^(                  scanUrl:)$', r'# 扫描 URL\n\1'),
        (r'^(                    format: uri)$', r'# 格式：URI\n\1'),
        (r'^(                    description: The URL to the scan)$', r'# 扫描的 URL\n\1'),
        
        # /block-lists 端点
        (r'^(  /block-lists:)$', r'# 阻止列表端点\n# 检查 URL 是否在各种阻止列表中\n\1'),
        (r'^(      summary: Retrieve block lists data)$', r'# 摘要：获取阻止列表数据\n\1'),
        (r'^(        - Security)$', r'# 归类到"安全"标签\n\1'),
        (r'^(                  blocklists:)$', r'# 阻止列表\n\1'),
        (r'^(                    type: array)$', r'# 数据类型：数组\n\1'),
        (r'^(                    items:)$', r'# 数组项\n\1'),
        (r'^(                      type: object)$', r'# 数据类型：对象\n\1'),
        (r'^(                      properties:)$', r'# 阻止列表项属性\n\1'),
        (r'^(                        server:)$', r'# 服务器名称\n\1'),
        (r'^(                          description: The name of the blocklist server)$', r'# 阻止列表服务器的名称\n\1'),
        (r'^(                        serverIp:)$', r'# 服务器 IP\n\1'),
        (r'^(                          description: The IP address of the blocklist server)$', r'# 阻止列表服务器的 IP 地址\n\1'),
        (r'^(                        isBlocked:)$', r'# 是否被阻止\n\1'),
        (r'^(                          type: boolean)$', r'# 数据类型：布尔值\n\1'),
        (r'^(                          description: Whether the URL is blocked by the server)$', r'# URL 是否被服务器阻止\n\1'),
        
        # /carbon 端点
        (r'^(  /carbon:)$', r'# 碳足迹端点\n# 获取网站的碳足迹和环境影响数据\n\1'),
        (r'^(      summary: Retrieve carbon data)$', r'# 摘要：获取碳足迹数据\n\1'),
        (r'^(                  statistics:)$', r'# 统计数据\n\1'),
        (r'^(                    type: object)$', r'# 数据类型：对象\n\1'),
        (r'^(                    properties:)$', r'# 统计属性\n\1'),
        (r'^(                      adjustedBytes:)$', r'# 调整后的字节数\n\1'),
        (r'^(                        type: number)$', r'# 数据类型：数字\n\1'),
        (r'^(                        format: float)$', r'# 格式：浮点数\n\1'),
        (r'^(                        description: Adjusted bytes transferred)$', r'# 传输的调整后字节数\n\1'),
        (r'^(                      energy:)$', r'# 能源消耗\n\1'),
        (r'^(                        description: Energy consumption in kWh)$', r'# 能源消耗（千瓦时）\n\1'),
        (r'^(                      co2:)$', r'# 二氧化碳排放\n\1'),
        (r'^(                        type: object)$', r'# 数据类型：对象\n\1'),
        (r'^(                        properties:)$', r'# CO2 属性\n\1'),
        (r'^(                          grid:)$', r'# 电网能源\n\1'),
        (r'^(                            type: object)$', r'# 数据类型：对象\n\1'),
        (r'^(                            properties:)$', r'# 电网属性\n\1'),
        (r'^(                              grams:)$', r'# 克数\n\1'),
        (r'^(                                description: CO2 emissions in grams from grid energy)$', r'# 电网能源的 CO2 排放量（克）\n\1'),
        (r'^(                              litres:)$', r'# 升数\n\1'),
        (r'^(                                description: CO2 emissions in litres from grid energy)$', r'# 电网能源的 CO2 排放量（升）\n\1'),
        (r'^(                          renewable:)$', r'# 可再生能源\n\1'),
        (r'^(                            properties:)$', r'# 可再生能源属性\n\1'),
        (r'^(                              grams:)$', r'# 克数\n\1'),
        (r'^(                                description: CO2 emissions in grams from renewable energy)$', r'# 可再生能源的 CO2 排放量（克）\n\1'),
        (r'^(                              litres:)$', r'# 升数\n\1'),
        (r'^(                                description: CO2 emissions in litres from renewable energy)$', r'# 可再生能源的 CO2 排放量（升）\n\1'),
        (r'^(                  cleanerThan:)$', r'# 清洁度百分比\n\1'),
        (r'^(                    type: integer)$', r'# 数据类型：整数\n\1'),
        (r'^(                    description: Percentage of websites that are less clean than the queried site)$', r'# 比查询网站更不清洁的网站百分比\n\1'),
        (r'^(                  rating:)$', r'# 环境评级\n\1'),
        (r'^(                    description: Environmental rating)$', r'# 环境评级（如 A+、A、B 等）\n\1'),
        (r'^(                  green:)$', r'# 是否绿色\n\1'),
        (r'^(                    type: boolean)$', r'# 数据类型：布尔值\n\1'),
        (r'^(                    description: Whether the site is green)$', r'# 网站是否为绿色网站\n\1'),
        
        # /cookies 端点
        (r'^(  /cookies:)$', r'# Cookie 端点\n# 获取网站的 Cookie 信息\n\1'),
        (r'^(      summary: Retrieve cookies data)$', r'# 摘要：获取 Cookie 数据\n\1'),
        (r'^(        - Server Info)$', r'# 归类到"服务器信息"标签\n\1'),
        (r'^(                  headerCookies:)$', r'# HTTP 头中的 Cookie\n\1'),
        (r'^(                    type: array)$', r'# 数据类型：数组\n\1'),
        (r'^(                    items:)$', r'# 数组项\n\1'),
        (r'^(                      type: string)$', r'# 数据类型：字符串\n\1'),
        (r'^(                      description: List of cookies from the HTTP headers)$', r'# HTTP 头中的 Cookie 列表\n\1'),
        (r'^(                  clientCookies:)$', r'# 客户端 Cookie\n\1'),
        (r'^(                    items:)$', r'# 数组项\n\1'),
        (r'^(                      type: object)$', r'# 数据类型：对象\n\1'),
        (r'^(                      properties:)$', r'# Cookie 属性\n\1'),
        (r'^(                        name:)$', r'# Cookie 名称\n\1'),
        (r'^(                          description: The name of the cookie)$', r'# Cookie 的名称\n\1'),
        (r'^(                        value:)$', r'# Cookie 值\n\1'),
        (r'^(                          description: The value of the cookie)$', r'# Cookie 的值\n\1'),
        (r'^(                        domain:)$', r'# Cookie 域名\n\1'),
        (r'^(                          description: The domain of the cookie)$', r'# Cookie 的域名\n\1'),
        (r'^(                        path:)$', r'# Cookie 路径\n\1'),
        (r'^(                          description: The path of the cookie)$', r'# Cookie 的路径\n\1'),
        (r'^(                        expires:)$', r'# Cookie 过期时间\n\1'),
        (r'^(                          format: float)$', r'# 格式：浮点数\n\1'),
        (r'^(                          description: The expiration time of the cookie in Unix time)$', r'# Cookie 的过期时间（Unix 时间戳）\n\1'),
        (r'^(                        size:)$', r'# Cookie 大小\n\1'),
        (r'^(                          type: integer)$', r'# 数据类型：整数\n\1'),
        (r'^(                          description: The size of the cookie)$', r'# Cookie 的大小（字节）\n\1'),
        (r'^(                        httpOnly:)$', r'# HttpOnly 属性\n\1'),
        (r'^(                          type: boolean)$', r'# 数据类型：布尔值\n\1'),
        (r'^(                          description: Whether the cookie is HttpOnly)$', r'# Cookie 是否为 HttpOnly\n\1'),
        (r'^(                        secure:)$', r'# Secure 属性\n\1'),
        (r'^(                          description: Whether the cookie is Secure)$', r'# Cookie 是否为 Secure\n\1'),
        (r'^(                        session:)$', r'# 会话 Cookie\n\1'),
        (r'^(                          type: boolean)$', r'# 数据类型：布尔值\n\1'),
        (r'^(                          description: Whether the cookie is a session cookie)$', r'# Cookie 是否为会话 Cookie\n\1'),
        (r'^(                        sameSite:)$', r'# SameSite 属性\n\1'),
        (r'^(                          description: The SameSite attribute of the cookie)$', r'# Cookie 的 SameSite 属性\n\1'),
        (r'^(                        priority:)$', r'# Cookie 优先级\n\1'),
        (r'^(                          description: The priority of the cookie)$', r'# Cookie 的优先级\n\1'),
        (r'^(                        sameParty:)$', r'# SameParty 属性\n\1'),
        (r'^(                          description: Whether the cookie is SameParty)$', r'# Cookie 是否为 SameParty\n\1'),
        (r'^(                        sourceScheme:)$', r'# 源协议\n\1'),
        (r'^(                          description: The source scheme of the cookie)$', r'# Cookie 的源协议\n\1'),
        
        # /dns-server 端点
        (r'^(  /dns-server:)$', r'# DNS 服务器端点\n# 获取网站的 DNS 服务器信息\n\1'),
        (r'^(      summary: Retrieve DNS server data)$', r'# 摘要：获取 DNS 服务器数据\n\1'),
        (r'^(                  domain:)$', r'# 域名\n\1'),
        (r'^(                    description: The domain name queried)$', r'# 查询的域名\n\1'),
        (r'^(                  dns:)$', r'# DNS 服务器列表\n\1'),
        (r'^(                    items:)$', r'# 数组项\n\1'),
        (r'^(                      type: object)$', r'# 数据类型：对象\n\1'),
        (r'^(                      properties:)$', r'# DNS 服务器属性\n\1'),
        (r'^(                        address:)$', r'# IP 地址\n\1'),
        (r'^(                          description: The IP address of the DNS server)$', r'# DNS 服务器的 IP 地址\n\1'),
        (r'^(                        hostname:)$', r'# 主机名\n\1'),
        (r'^(                          type: array)$', r'# 数据类型：数组\n\1'),
        (r'^(                          items:)$', r'# 数组项\n\1'),
        (r'^(                            type: string)$', r'# 数据类型：字符串\n\1'),
        (r'^(                          description: Hostnames associated with the DNS server)$', r'# 与 DNS 服务器关联的主机名\n\1'),
        (r'^(                          nullable: true)$', r'# 可为空\n\1'),
        (r'^(                        dohDirectSupports:)$', r'# DoH 支持\n\1'),
        (r'^(                          type: boolean)$', r'# 数据类型：布尔值\n\1'),
        (r'^(                          description: Whether the server supports DoH \(DNS over HTTPS\) directly)$', r'# 服务器是否直接支持 DoH（DNS over HTTPS）\n\1'),
        
        # /dns 端点
        (r'^(  /dns:)$', r'# DNS 端点\n# 获取网站的 DNS 记录\n\1'),
        (r'^(      summary: Retrieve DNS data)$', r'# 摘要：获取 DNS 数据\n\1'),
        (r'^(                  A:)$', r'# A 记录（IPv4 地址）\n\1'),
        (r'^(                    type: object)$', r'# 数据类型：对象\n\1'),
        (r'^(                    properties:)$', r'# A 记录属性\n\1'),
        (r'^(                      address:)$', r'# IP 地址\n\1'),
        (r'^(                        description: IPv4 address)$', r'# IPv4 地址\n\1'),
        (r'^(                      family:)$', r'# IP 协议族\n\1'),
        (r'^(                        type: integer)$', r'# 数据类型：整数\n\1'),
        (r'^(                        description: IP family)$', r'# IP 协议族（4 表示 IPv4，6 表示 IPv6）\n\1'),
        (r'^(                  AAAA:)$', r'# AAAA 记录（IPv6 地址）\n\1'),
        (r'^(                    type: array)$', r'# 数据类型：数组\n\1'),
        (r'^(                    items:)$', r'# 数组项\n\1'),
        (r'^(                      type: string)$', r'# 数据类型：字符串\n\1'),
        (r'^(                    description: List of IPv6 addresses)$', r'# IPv6 地址列表\n\1'),
        (r'^(                  MX:)$', r'# MX 记录（邮件交换服务器）\n\1'),
        (r'^(                    type: array)$', r'# 数据类型：数组\n\1'),
        (r'^(                    items:)$', r'# 数组项\n\1'),
        (r'^(                      type: string)$', r'# 数据类型：字符串\n\1'),
        (r'^(                    description: List of mail exchange servers)$', r'# 邮件交换服务器列表\n\1'),
        (r'^(                  TXT:)$', r'# TXT 记录\n\1'),
        (r'^(                    type: array)$', r'# 数据类型：数组\n\1'),
        (r'^(                    items:)$', r'# 数组项\n\1'),
        (r'^(                      type: object)$', r'# 数据类型：对象\n\1'),
        (r'^(                      properties:)$', r'# TXT 记录属性\n\1'),
        (r'^(                        exchange:)$', r'# 交换服务器\n\1'),
        (r'^(                          description: Exchange server)$', r'# 交换服务器\n\1'),
        (r'^(                        priority:)$', r'# 优先级\n\1'),
        (r'^(                          description: Priority of the DNS record)$', r'# DNS 记录的优先级\n\1'),
    ]
    
    # 应用所有替换规则
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content, flags=re.MULTILINE)
    
    # 写入输出文件
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ 文件处理完成！")
    print(f"输入文件: {input_file}")
    print(f"输出文件: {output_file}")

if __name__ == '__main__':
    # 输入和输出文件路径
    input_file = '/home/pps/code/web-check/web-check/public/resources/openapi-spec.yml'
    output_file = '/home/pps/code/web-check/web-check/public/resources/openapi-spec.yml'
    
    # 执行翻译
    translate_openapi_spec(input_file, output_file)