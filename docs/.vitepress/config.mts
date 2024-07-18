import { defineConfig } from 'vitepress'
const config_sw_perfrom = require('../packages/sw_eng/software_performance_engineer/config.js');

console.log("config_sw_perfrom = ", config_sw_perfrom)
// https://vitepress.dev/reference/site-config

export default defineConfig({
  base: '/reading-notes/',
  title: "Ron's CS reading notes",
  description: "Ron's reading notes of Mathematics & EECS from MIT, Stanford",
  lang: 'en-US',
  head: [
    ['link' , {rel: 'icon', href: "/reading-notes/logo.png"}],
  ],
  rewrites :{
    "packages/:pkg/:subject/(.*)": ":subject/(.*)",
    "packages/:subject/(.*)": ":subject/(.*)"
  },
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
  
    search: {
      provider: "local"
    },
    nav: [
      { text: 'Home', link: '/' },
      { 
        text: 'Language', 
        items: [
          {text: "English", link: "/index"},
          {text: "中文", link: "/index_zh"},
        ]

      }
    ],
    logo: '/logo.png',
    sidebar: {
      '/': [
        {
          text: '编程与软件工程',
          collapsed: false,
          items: [
            { text: "编程基础(Python版)", link: "/fundamentals_of_programming"},
            { text: "软件构造基础", link: "/element_of_software_construction"},
            { text: "软件设计", link: "/software_design"},
            { text: "软件性能工程", link: "/software_performance_engineer"},
            { text: "算法工程", link: "/algorithm_engineer"},
            { text: "多核编程", link: "/multicore_programming"},
          ]
        },
        {
          text: '理论计算机',
          collapsed: true,
          items: [
            {text: "计算机数学"},
            {text: "算法导论"},
            {text: "算法设计和分析"},
            {text: "可计算性和复杂度理论"},
            {text: "分布式算法"},
            {text: "高级数据结构"}
  
          ]
        },
        {
          text: '编程语言',
          collapsed: true,
          items: [
            {text: "计算机语言工程(编译原理)"},
            {text: "计算机动态语言工程(js版)"},
            {text: "计算机程序的结构与解释"},
          ]
        },
        {
          text: '计算机系统',
          collapsed: true,
          items: [
            {text: "计算机系统工程", link: "/computer_sys_eng"},
            {text: "操作系统工程"},
            {text: "计算机网络"},
            {text: "移动和传感计算"},
            {text: "计算机系统与社会"},
            {text: "数据库系统", link: "/database_systems"},
            {text: "分布式系统"},
            {text: "计算机系统原理"},
          ]
        },
        {
          text: '计算机架构',
          collapsed: true,
          items: [
            {text: "低级语言编程导论(C和汇编)"},
            {text: "计算结构"},
            {text: "结构化计算机设计"},
            {text: "计算机系统架构"},
            {text: "复杂数字系统设计"},
            {text: "并行计算"},
            {text: "数据中心计算"}
          ]
        },
        {
          text: "安全与加密",
          collapsed: true,
          items: [
            {text: "安全与加密应用"}
          ]
        },
      ],
      '/software_performance_engineer/': [
        {
          text: '软件性能工程',
          collapsed: false,
          link: "./index",
          items: [
            { text: "lec0 课程介绍", link: "lec0"},
            { text: "lec01 引入和矩阵乘法", link: "./lec1" },
            { text: "lec02 Bentley Rule", link: "./lec2" },
            { text: "lec03 二进制的巧用方法", link: "./lec3" },
            { text: "lec04 汇编语言和计算机体系结构", link: "./lec4" },
            { text: "lec05 C 到 汇编", link: "./lec5" },
            { text: "lec06 多核编程", link: "./lec6" },
            { text: "lec07 竞态和并行", link: "./lec7" },
            { text: "lec08 多线程算法分析", link: "./lec8" },
            { text: "lec09 编译器能做什么和不能做什么", link: "./lec9" },
            { text: "lec10 测量和计时", link: "./lec10" },
            { text: "lec11 存储分配", link: "./lec11" },
            { text: "lec13 Cilk运行时系统", link: "./lec13" },
            { text: "lec14 缓存和高速缓存算法", link: "./lec14" },
            { text: "lec15 缓存无关算法", link: "./lec15" },
            { text: "lec12 存储分配的并行", link: "./lec12" },
            { text: "lec16 不确定性程序的并行", link: "./lec16" },
            { text: "lec20 投机性并行", link: "./lec20" },
            { text: "lec17 无锁同步", link: "./lec17" },
            { text: "lec18 特定领域语言和自动调优", link: "./lec18" },
            { text: "lec23 动态语言的高性能", link: "./lec23" },
            { text: "lec19 西洋棋代码走读", link: "./lec19" },
            { text: "lec21 旅行商问题", link: "./lec21" },
            { text: "lec22 图优化", link: "./lec22" }
          ]
        },
      ],
      '/computer_sys_eng/': [
        {
          text: '计算机系统工程',
          collapsed: false,
          link: "./index",
          items: [
            { text: "lec01 复杂度，模块化，抽象思维", link: "./lec1" },
            { text: "lec02 命名系统", link: "./lec2" },
            { text: "lec03 虚拟内存", link: "./lec3" },
            { text: "lec04 有界缓冲区，锁", link: "./lec4" },
            { text: "lec05 线程", link: "./lec5" },
            { text: "lec06 虚拟机", link: "./lec6" },
            { text: "lec07 性能（存储）", link: "./lec7" },
            { text: "lec08 计算机网络介绍", link: "./lec8" },
            { text: "lec09 路由", link: "./lec9" },
            { text: "lec10 BGP", link: "./lec10" },
            { text: "lec11 TCP", link: "./lec11" },
            { text: "lec13 网络资源管理", link: "./lec13" },
            { text: "lec12 应用层", link: "./lec12" },
            { text: "lec14 数据中心和云", link: "./lec14" },
            { text: "lec15 可靠性", link: "./lec15" },
            { text: "lec16 原子性、隔离性、事务", link: "./lec16" },
            { text: "lec17 logging", link: "./lec17" },
            { text: "lec18 隔离性", link: "./lec18" },
            { text: "lec19 分布式事务", link: "./lec19" },
            { text: "lec20 复制", link: "./lec20" },
            { text: "lec21 身份认证", link: "./lec21" },
            { text: "lec22 低级别攻击", link: "./lec22" },
            { text: "lec23 安全通道", link: "./lec23" },
            { text: "lec24 ToR", link: "./lec24" },
            { text: "lec25 网络攻击", link: "./lec25" },
          ]
        },
      ],
      '/database_systems/': [
        {
          text: '数据库系统',
          collapsed: false,
          link: "./index",
          items: [
            { text: "lec01 关系模型 & SQL(Part I)", link: "./lec1" },
            { text: "lec02 SQL(Part II)", link: "./lec2" },
            { text: "lec03 Schema设计", link: "./lec3" },
            { text: "lec04a 数据库存储", link: "./lec4a" },
            { text: "lec04b 数据库内部", link: "./lec4b" },
            { text: "lec12 故障恢复(Part I)", link: "./lec12" },
            { text: "lec13 故障恢复(Part II)", link: "./lec13" },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://gitee.com/ron26' },
    ]
  }
});
