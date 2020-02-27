var nav = require('./nav.js')
var {GuideNav, EcosystemNav, ElementComponentNav, BusinessComponentNav} = nav

var utils = require('./utils.js')
var {genNav, getComponentSidebar, deepClone} = utils

module.exports = {
	title: 'web-cloud',
	description: 'A magical web cloud',
	markdown: { //markdown编辑器的配置
		lineNumbers: true, //代码显示行号，默认 false
		toc: {includeLevel: [3]}, //显示目录的默认层级
	},
	base: '/web-cloud-site/',
	head: [
		[
			'link',
			{
				rel: 'icon',
				href: '/favicon.ico'
			}
		]
	],
	themeConfig: {
		repo: 'https://github.com/qsjdhm/web-cloud',
		docsRepo: 'https://github.com/qsjdhm/web-cloud/docs',
		docsDir: '/',
		editLinks: true,
		sidebarDepth: 3,
		locales: {
			'/': {
				label: '简体中文',
				selectText: '选择语言',
				editLinkText: '在 GitHub 上编辑此页',
				nav: [
					{
						text: '指南',
						link: '/docs/guide/'
					},
					{
						text: '元素组件',
						items: genNav(deepClone(ElementComponentNav))
					},
					{
						text: '业务组件',
						items: genNav(deepClone(BusinessComponentNav))
					},
					{
						text: '生态系统',
						items: genNav(deepClone(EcosystemNav))
					},
					{
						text: '捐赠',
						link: '/docs/donate/'
					}
					// ,
					// {
					// 	text: '招聘',
					// 	link: '/docs/job/'
					// }
				],
				sidebar: {
					'/docs/guide/': [
						{
							title: '基础',
							collapsable: false,
							children: GuideNav.essentials
						},
						{
							title: '进阶',
							collapsable: false,
							children: GuideNav.advanced
						},
						{
							title: '其它',
							collapsable: false,
							children: GuideNav.other
						}
					],

					'/components/': getComponentSidebar(deepClone(ElementComponentNav)),
					'/docs/feature/component/': getComponentSidebar(deepClone(BusinessComponentNav)),
					'/docs/feature/script/': [
						'/docs/feature/script/svgo.md',
						'/docs/feature/script/new.md'
					]
				}
			}
		}
	},
	locales: {
		'/': {
			lang: 'zh-CN',
			description: 'A magical web cloud'
		}
	},
	configureWebpack: {
		resolve: {
			alias: {
				'@public': './public'
			}
		}
	},
	// 文档更新时间：每个文件git最后提交的时间,
	lastUpdated: 'Last Updated'
}
