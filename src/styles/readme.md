## styles文档结构
------------------
### 一、结构
>styles
>>common.scss  
>>element-ui.scss  
>>element-variables.scss  
>>index.scss  
>>mixin.scss  
>>readme.md  
>>variables.scss 
### 二、文件存放解释
|文件名称|解释|
|:---:|:---:|
|common.scss|通用全局样式存放文件|
|element-ui.scss|element-ui样式重置文件|
|element-variables.scss|element-ui主题样式(变量)文件|
|index.scss|scss引用整合文件|
|mixin.scss|mixin样式存放文件|
|readme.md|style文件结构解释文档|
|variables.scss|此文件与element-variables.scss应整合到一起(待整合)|
### 三、修改记录
#### 2019-12-10
1.variables.scc文件应整合到element-variables.scss文件中，但多处引用此文件，需要做优化  
2.将transition.scss删除并整合到common.scss文件中  
3.将sidebar.scss删除并迁移到sidebar组件内，但加scoped属性后样式失效，怀疑其他地方有用到此文件样式，需优化  
4.将mixin.scss文件中除函数外的样式迁移到common.scss文件中  
5.将flex.scss文件删除并整合到common.scss文件中  
6.删除page-reset.scss文件  
7.将btn.scss文件删除并迁移到element-ui.scss文件中  
8.将base.scss文件删除  
9.将DataCollection文件夹删除，将DataCollection文件夹下gatewayList.scss文件迁移到相关vue文件中
