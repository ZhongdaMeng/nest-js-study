# NestJS 学习项目

## 技术栈

- **框架**: NestJS 11 + TypeScript 5.7
- **包管理**: pnpm
- **数据库**: MySQL (远程服务器 `192.168.31.114:3306`)
- **ORM**: TypeORM 1.0 (`synchronize: true` 自动同步表结构)
- **认证**: JWT (`@nestjs/jwt` + bcrypt)

## 环境配置

| 环境 | NODE_ENV | .env 文件 | 数据库 |
|------|----------|-----------|--------|
| 开发 | `development` | `.env.development` | `learn_fullstack_dev` |
| 生产 | `production` | `.env.production` | `learn_fullstack_prod` |

- `pnpm start:dev` → 开发模式，自动加载 `.env.development`
- `pnpm start:prod` → 生产模式，加载 `.env.production`

## 服务器信息

```
地址: 192.168.31.114
SSH: ssh mzdmeng (已配 ED25519 免密)
MySQL: mzdmeng / MzdMySQL2024!
```

## 项目结构

```
src/
├── main.ts                  # 入口，全局前缀 /api，全局异常过滤器
├── app.module.ts             # 根模块，注册全局 JWT 守卫
├── config/
│   └── database.config.ts    # TypeORM 配置
├── entities/
│   └── user.entity.ts        # User 实体
├── auth/
│   ├── auth.module.ts        # JWT 注册
│   ├── auth.controller.ts    # POST /api/register, /api/login, GET /api/profile
│   ├── auth.service.ts       # 业务逻辑
│   ├── jwt-auth.guard.ts     # 全局 JWT 守卫
│   └── public.decorator.ts   # @Public() 标记公开路由
├── user/
│   └── user.module.ts        # 暴露 TypeOrmModule.forFeature([User])
└── common/
    └── http-exception.filter.ts  # 全局异常过滤器
```

## API 响应格式

**所有接口统一返回 `{ code, msg, data? }`**

```json
// 成功
{ "code": 200, "msg": "登录成功", "data": { "token": "xxx" } }

// 异常（由全局过滤器自动处理）
{ "code": 401, "msg": "用户名或密码错误" }
```

| code | 含义 | 前端行为 |
|------|------|---------|
| 0 / 200 | 成功 | 返回 `response.data` |
| 400 | 请求错误 | reject msg |
| 401 | 未登录 | 跳转登录页 |
| 500 | 服务器错误 | reject msg |

## API 接口

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | `/api/register` | 公开 | 用户注册 |
| POST | `/api/login` | 公开 | 用户登录，返回 token |
| GET | `/api/profile` | 需 token | 获取当前用户信息 |

### 认证
- 登录后前端在请求头携带 `Authorization: Bearer <token>`
- 全局 `JwtAuthGuard` 拦截所有请求，`@Public()` 装饰器可跳过校验
- JWT 有效期 7 天

## 代码规范

- URL 路由: kebab-case (`/api/user-info`)
- TypeScript 方法名: camelCase (`getUserInfo`)
- TypeORM Entity 属性加 `!` (definite assignment assertion)
- `import type` 用于仅作类型使用的导入
