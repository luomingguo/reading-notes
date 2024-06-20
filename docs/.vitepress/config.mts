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
            {text: "计算机系统工程"},
            {text: "移动和传感计算"},
            {text: "操作系统工程"},
            {text: "计算机网络"},
            {text: "数据库系统"},
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
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://gitee.com/ron26' },
    ]
  }
});
