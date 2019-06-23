# docker 笔记
> http://www.docker.org.cn/
## 什么是docker
* Docker在容器的基础上进行了进一步封装，从文件系统，网络互联到进程隔离等等，极大的简化的了容器的创建和维护
* 相比与虚拟化技术，docker能够更好的利用宿主机的资源，而且资源是共享的

## 为什么使用docker
* 更高效的利用系统资源
** 容器不需要进行硬件虚拟以及运行完整操作系统等额外开销
** 相比于虚拟技术，一个配置相同的主机，可以运行更多数量的应用
* 更快速的启动时间，传统虚拟机技术启动服务往往需要数分钟，而docker基于宿主机的内核，可以大大减少时间成本，节约
开发部署测试时间
* 一致的运行环境，docker镜像提供了除内核外完整的运行时环境，确保了应用环境的一致性
* 持续交付和持续部署，开发人员可以通过Dockerfile来进行镜像构建，从而一次创建或者配置，可以处处运行
* 更轻松的迁移，docker确保了执行环境的一致性，使得应用迁移更加容易
* 更轻松的维护和扩展，docker使用分层存储和镜像技术，使得应用复用更容易，基于基础镜像的扩展镜像也非常简单

## 对比传统虚拟机总结
特性|容器|虚拟机
-|-|-
启动|秒级|分钟级
磁盘使用|一般为MB|一般为GB
性能|接近原生|弱于原生
系统支持量|单机支持上千容器|一般几十个

## docker引擎
Dockers引擎是一个包含以下主要组件的客户端服务器应用程序
* 一种服务器，它是一种称为守护进程并且长时间运行的程序
* Rest Api用于指定程序可以用来与守护进程通信的接口，并指示它做什么
* 一个由命令行界面工具的客户端

## docker系统架构
标题|说明
-|-
镜像|docker镜像是用于创建docker容器的模板
容器|容器是独立运行的一个或一组应用
客户端|docker客户端使用命令行工具或者其他工具与docker的守护进程通信
主机|一个物理或者虚拟的机器用于执行docker的守护进程和容器
仓库|docker仓库用于保存镜像，可以理解为代码控制中的代码仓库
Docker Machine|Docker Machine是一个简化docker安装的命令行工具，通过一个简单的命令就可以在相应的平台上安装docker

## Docker镜像
* docker镜像是一个特殊的文件系统，除了提供运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时
准备的配置参数（如匿名卷，环境变量，用户等），镜像不包含任何动态数据，其内容在构建后也不会被改变
* 镜像构建时，会一层层的构建，前一层时后一层 的基础，每一层构建完不会再发生改变

## Docker容器
* 容器的实质是进程，但与直接在宿主机执行的进程不同，容器的进程运行于属于自己的独立的命名空间
* 每个容器运行时，以镜像为基础层，在其上创建一个当前容器的储存层，我们称这个为容器运行时读写而准备的层为容器储存层
* 最佳实践，容器的储存层要保持无状态化，所有文件写入都应该使用数据卷，或者绑定宿主目录，这些位置的读写会跳过储存层
* 数据卷的生命周期独立于容器

## docker安装
* https://docs.docker.com/install/linux/docker-ce/ubuntu/

## docker基本操作
* docker pull 镜像名   拉取docker镜像
* docker run 参数|镜像名  运行容器
    ** `docker run -it --rm tomcat bash`表示以交互的方式启动容器，使用完毕后删除容器
    ** `docker run -p 8080:8080 --name tomcat -d tomcat`-p表示宿主机端口和容器映射端口，--name表示名称
    -d表示以守护状态运行
* docker ps 查看正在运行的容器
* docker ps -a 查看所有容器
* docker restart id 启动停止的容器
    ** docker 在运行容器时 添加--rm会在运行后删除数据，如果没加这个参数会保留停止运行的容器信息
    ** 使用`docker rm id`来删除不用的容器
* docker image rm id 删除镜像
* docker image prune 删除虚悬镜像

## docker使用镜像
### 如何获取镜像
* docker pull [OPTIONS] NAME[:TAG|@DIGEST]
    ** OPTIONS说明：
    ** -a :拉取所有 tagged 镜像
    ** --disable-content-trust :忽略镜像的校验,默认开启
    ** :TAG表示获取指定版本号的镜像

## 使用Dockerfile来定制镜像
* 创建一个目录
* 创建一个Dockerfile文件
* 向Dockerfile中写入脚本
    ** FROM指定基础镜像
    ** RUN 执行命令
    ** EXPOSE 暴露容器的端口
    ** CMD容器启动命令
* 在Dockerfile文件所在的目录构建镜像
    ** docker build [选项]<上下文路径/url/->
* 构建镜像的上下文
    ** docker是以cs架构来执行命令的，表面上看是本地操作，实际上是通过rest API 来远程调用
    ** docker的构建实际上是在服务端构建的，而进行构建的脚本通常需要添加文件，而服务端需要知道本机的文件路径
    ** 所以docker build -t myshop .中的.指的就是上下文目录
    ** 在使用build的时候，会将上下文目录打包，通过REST API发送给服务端，服务端在构建的时候会将整个打包后的目
    录进行构建

## 数据卷
* 数据卷是供一个或者多个容器使用的特殊目录，它绕过UFS，可以提供很多有用的特性
    ** 数据卷可以在容器之间共享和重用
    ** 对数据卷的修改会立马生效
    ** 对数据卷的修改不会印象镜像
    ** 数据卷会默认一直存在即使镜像被删除
* 使用数据卷
    ** `docker run -p 8080:8080 -d -v /usr/local/docker/tomcat/ROOT:/usr/local/tomcat/webapps/ROOT tomcat`
    /usr/local/tomcat/conf
    docker run --name tomcat -p 8080:8080  -v /usr/local/docker/tomcat/ROOT:/usr/local/tomcat/webapps/ROOT -v /usr/local/docker/tomcat/conf:/usr/local/tomcat/conf tomcat
    -v参数表示使用数据卷，：前面的目录是宿主机的目录，后面的目录是需要替换的目录

 * docker run --name mysql -p 3306:3306 -v /usr/local/docker/tomcat/datadir:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=root -d mysql

## docker compose
docker compose是docker官方编排的项目之一，负责快速部署分布式应用
### docker compose简介
* 负责实现对docker容器集群的快速编排
* 现实中经常需要多个容器互相配合完成任务
* 使用docker-compose.yml模板文件来定义一组相关联的容器为一个项目
* compose中的两个重要的概念
    ** 服务：一个应用容器，实际上可以包括若干运行相同镜像的容器实例
    ** 项目：由一组相关联的应用容器组成一个完整的业务单元，在docker-compose.yml中定义
* compose的默认管理对象是项目，通过子命令对项目中的一组容器进行敏捷的生命周期管理

## docker compose安装
* https://docs.docker.com/compose/


