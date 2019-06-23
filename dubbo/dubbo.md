# dubbo 笔记
dubbo官网 http://dubbo.apache.org/zh-cn/index.html

## 分布式系统
* 系统是若干独立计算机的集合，这些计算机对用户来说就像是单个系统
* 随着互联网的发展，网站应用规模不断扩大，垂直架构无法应付，分布式架构势在必行 
* 分布式的通信，RPC远程过程调用
* RPC核心就是通过socket和反射技术，将A上的参数发送到B，B执行后将结果返回给A

## dubbo核心概念
### 简介
* 高性能，轻量级的开源RPC框架，提供了三大核心能力：面向接口的远程方法调用，智能容错和负载均衡以及服务自动注册
和发现

### 架构
* 角色：Provider 暴露服务的服务提供方； Consumer  调用远程服务的服务消费方；Registry   服务注册与发现的注册中心；
Monitor 统计服务的调用次数和调用时间的监控中心；Container   服务运行容器
** 服务容器负责启动，加载，运行服务提供者。
** 服务提供者在启动时，向注册中心注册自己提供的服务。
** 服务消费者在启动时，向注册中心订阅自己所需的服务。
** 注册中心返回服务提供者地址列表给消费者，如果有变更，注册中心将基于长连接推送变更数据给消费者。
** 服务消费者，从提供者地址列表中，基于软负载均衡算法，选一台提供者进行调用，如果调用失败，再选另一台调用。
** 服务消费者和提供者，在内存中累计调用次数和调用时间，定时每分钟发送一次统计数据到监控中心。
> Dubbo 架构具有以下几个特点，分别是连通性、健壮性、伸缩性、以及向未来架构的升级性。

## 配置
参照官网进行配置

## 高可用
### zookeeper宕机与dubbo直连
* 在zookeeper宕机后仍然可以消费dubbo暴露的服务
* 原因：健壮性
** 监控中心宕机不影响使用，只是丢失部分采样数据
** 数据库宕机，注册中心仍能通过缓存提供服务列表查询，但不能注册新服务
** 注册中心对等集群，任意一台宕机，自动切换另一台
** 注册中心全部宕机，服务提供者和消费者仍能通过本地缓存通讯
** 服务提供者无状态，任意一台宕掉不影响使用
** 服务提供者全部宕掉，服务消费者应用将无法使用，并无限次重连等待服务提供者恢复
* 高可用，通过设计，减少系统不能提供服务的时间

## 集群下dubbo的负载均衡
在集群负载均衡时，Dubbo 提供了多种均衡策略，缺省为 random 随机调用。
* Random LoadBalance
** 随机，按权重设置随机概率。
** 在一个截面上碰撞的概率高，但调用量越大分布越均匀，而且按概率使用权重后也比较均匀，有利于动态调整提供者权重。
* RoundRobin LoadBalance
** 轮询，按公约后的权重设置轮询比率。
** 存在慢的提供者累积请求的问题，比如：第二台机器很慢，但没挂，当请求调到第二台时就卡在那，久而久之，所有请求都卡在调到第二台上。
* LeastActive LoadBalance
** 最少活跃调用数，相同活跃数的随机，活跃数指调用前后计数差。
** 使慢的提供者收到更少请求，因为越慢的提供者的调用前后计数差会越大。
* ConsistentHash LoadBalance
** 一致性 Hash，相同参数的请求总是发到同一提供者。
** 当某一台提供者挂时，原本发往该提供者的请求，基于虚拟节点，平摊到其它提供者，不会引起剧烈变动。
** 算法参见：http://en.wikipedia.org/wiki/Consistent_hashing
** 缺省只对第一个参数 Hash，如果要修改，请配置 <dubbo:parameter key="hash.arguments" value="0,1" />
** 缺省用 160 份虚拟节点，如果要修改，请配置 <dubbo:parameter key="hash.nodes" value="320" />

## 服务降级
当服务器压力剧增的情况下，根据实际业务及流量，对一些服务和页面有策略的不处理或换种简单的处理方式，从而释放
服务器资源以保证核心交易正常运作或者高效运作
* 可以通过服务降级功能 [1] 临时屏蔽某个出错的非关键服务，并定义降级后的返回策略。
* 向注册中心写入动态配置覆盖规则：
```
RegistryFactory registryFactory = ExtensionLoader.getExtensionLoader(RegistryFactory.class).getAdaptiveExtension();
Registry registry = registryFactory.getRegistry(URL.valueOf("zookeeper://10.20.153.10:2181"));
registry.register(URL.valueOf("override://0.0.0.0/com.foo.BarService?category=configurators&
dynamic=false&application=foo&mock=force:return+null"));
```
* 其中：
** mock=force:return+null 表示消费方对该服务的方法调用都直接返回 null 值，不发起远程调用。
用来屏蔽不重要服务不可用时对调用方的影响。
** 还可以改为 mock=fail:return+null 表示消费方对该服务的方法调用在失败后(超时)，再返回 null 值，不抛异常。
用来容忍不重要服务不稳定时对调用方的影响。

## 集群容错
http://dubbo.apache.org/zh-cn/docs/user/demos/fault-tolerent-strategy.html

## dubbo原理
### RPC原理
一次完整的RPC调用流程（同步调用，异步另说）如下：
1. 服务消费方(client)以本地调用的方式调用服务
2. client stub接收调用后负责将方法、参数组装成能够进行网络传输的消息体
3. client stub找到服务地址，并将消息发送给服务端
4. server stub接收到消息后进行解码
5. server stub根据解码结果调用本地服务
6. 本地服务执行，并将结果返回给server stub
7. server stub将结果打包成消息，并发送给消费方
8. client sutb接收到消息并进行解码
9. 服务消费方最终得到结果
> RPC框架的目标就是想2-8步封装起来，这些细节对用户来说是透明的，不可见的

### dubbo底层是基于netty通信
netty基于NIO模型

### dubbo原理
* 框架设计
* 启动解析、加载配置信息
* 服务暴露
* 服务引用
* 服务调用

##dubbo stater
### Dubbo控制台文档
* https://github.com/apache/dubbo-admin/blob/develop/README_ZH.md

### Dubbo快速开始
* https://github.com/apache/dubbo-spring-boot-project/blob/master/README_CN.md

### Dubbo的负载均衡
http://dubbo.apache.org/zh-cn/docs/user/demos/loadbalance.html

### Dubbo的快速序列化
http://dubbo.apache.org/zh-cn/docs/user/demos/serialization.html
* 添加一下依赖
```
<dependency>
            <groupId>de.javakaffee</groupId>
            <artifactId>kryo-serializers</artifactId>
            <version>0.45</version>
        </dependency>
        <dependency>
            <groupId>com.esotericsoftware</groupId>
            <artifactId>kryo</artifactId>
            <version>4.0.2</version>
        </dependency>
````

### 使用Hystrix实现服务熔断
* 添加以下依赖
```
<!-- https://mvnrepository.com/artifact/org.springframework.cloud/spring-cloud-starter-netflix-hystrix -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
    <version>2.1.1.RELEASE</version>
</dependency>

```
* 在提供者主类中添加注解@EnableHystrix
* 在提供者实现类的方法中添加@HystrixCommand
* 在消费者的调用类中增加 @HystrixCommand(fallbackMethod = "hiHystrix")，并添加回调方法hiHystrix（）

#### 使用熔断器的仪表盘监控
* 在服务消费者中添加以下依赖
```
<!-- https://mvnrepository.com/artifact/org.springframework.cloud/spring-cloud-starter-netflix-hystrix-dashboard -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix-dashboard</artifactId>
    <version>2.1.1.RELEASE</version>
</dependency>
```
* 在主类中添加注解@EnableHystrixDashboard
* 然后添加一个配置类
```
@Configuration
public class HystrixDashboardConfiguration {
    @Bean
    public ServletRegistrationBean getServlet(){
        HystrixMetricsStreamServlet streamServlet=new HystrixMetricsStreamServlet();
        ServletRegistrationBean registrationBean=new ServletRegistrationBean(streamServlet);
        registrationBean.setLoadOnStartup(1);
        registrationBean.addUrlMappings("/hystrix.stream");
        registrationBean.setName("HystrixMetricsStreamServlet");
        return registrationBean;
    }
}
```

