# followBot

```shell
npm install
node index.js
```
需要填写两个配置文件，可参考.example例子

watch_address.js 里填写要监听的地址
.env 填写钱包地址（PUBLIC_KEY），私钥，alchemy或其他节点服务的地址
默认0.01内的视为免费mint，可调节阈值maxPrice

其中bark是我使用的手机通知服务，ios可以在app store下载，会给一个调用url填入
如果没有ios可以把bark函数注释掉或添加其他通知服务


[Bark下载](https://apps.apple.com/cn/app/bark-customed-notifications/id1403753865)
[Alchemy注册](https://alchemy.com/?r=Dc3ODc5OTkwMDY2N)

[关注我的Twitter](https://twitter.com/magic_talent)