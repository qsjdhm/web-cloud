/* eslint-disable */
 export default {
	"dict-controller": {
		"dict-post": {
			"url": "/SERVICE-SYSTEM/api/dict",
			"method": "post"
		},
		"dict-put": {
			"url": "/SERVICE-SYSTEM/api/dict",
			"method": "put"
		},
		"itemCodes-get": {
			"url": "/SERVICE-SYSTEM/api/dict/dictItem/itemCodes",
			"method": "get"
		},
		"itemCode-get": {
			"url": "/SERVICE-SYSTEM/api/dict/dictItem/{itemCode}",
			"method": "get"
		},
		"item-post": {
			"url": "/SERVICE-SYSTEM/api/dict/item",
			"method": "post"
		},
		"item-put": {
			"url": "/SERVICE-SYSTEM/api/dict/item",
			"method": "put"
		},
		"all-get": {
			"url": "/SERVICE-SYSTEM/api/dict/item/all",
			"method": "get"
		},
		"status-put": {
			"url": "/SERVICE-SYSTEM/api/dict/status",
			"method": "put"
		},
		"useful-get": {
			"url": "/SERVICE-SYSTEM/api/dict/item/useful",
			"method": "get"
		},
		"code-get": {
			"url": "/SERVICE-SYSTEM/api/dict/item/{code}",
			"method": "get"
		},
		"page-get": {
			"url": "/SERVICE-SYSTEM/api/dict/page",
			"method": "get"
		}
	},
	"permission-controller": {
		"permission-post": {
			"url": "/SERVICE-SYSTEM/api/permission",
			"method": "post"
		},
		"permission-put": {
			"url": "/SERVICE-SYSTEM/api/permission",
			"method": "put"
		},
		"grant-put": {
			"url": "/SERVICE-SYSTEM/api/permission/grant",
			"method": "put"
		},
		"permissionId1-get": {
			"url": "/SERVICE-SYSTEM/api/permission/info/{permissionId1}",
			"method": "get"
		},
		"page-get": {
			"url": "/SERVICE-SYSTEM/api/permission/page",
			"method": "get"
		},
		"permissionType-get": {
			"url": "/SERVICE-SYSTEM/api/permission/resource/{permissionType}",
			"method": "get"
		},
		"permissionId2-get": {
			"url": "/SERVICE-SYSTEM/api/permission/resourcesId/{permissionId2}",
			"method": "get"
		},
		"permissionId3-get": {
			"url": "/SERVICE-SYSTEM/api/permission/role/{permissionId3}",
			"method": "get"
		},
		"sysPermissionId-delete": {
			"url": "/SERVICE-SYSTEM/api/permission/{sysPermissionId}",
			"method": "delete"
		}
	},
	"group-controller": {
		"group-post": {
			"url": "/SERVICE-SYSTEM/api/v1/group",
			"method": "post"
		},
		"group-put": {
			"url": "/SERVICE-SYSTEM/api/v1/group",
			"method": "put"
		},
		"children-get": {
			"url": "/SERVICE-SYSTEM/api/v1/group/children",
			"method": "get"
		},
		"getList-get": {
			"url": "/SERVICE-SYSTEM/api/v1/group/getList",
			"method": "get"
		},
		"groupIds-post": {
			"url": "/SERVICE-SYSTEM/api/v1/group/groupIds",
			"method": "post"
		},
		"tree-get": {
			"url": "/SERVICE-SYSTEM/api/v1/group/tree",
			"method": "get"
		},
		"list-get": {
			"url": "/SERVICE-SYSTEM/api/v1/group/user/list",
			"method": "get"
		},
		"groupId-get": {
			"url": "/SERVICE-SYSTEM/api/v1/group/{groupId}",
			"method": "get"
		},
		"groupId-delete": {
			"url": "/SERVICE-SYSTEM/api/v1/group/{groupId}",
			"method": "delete"
		}
	},
	"resource-controller": {
		"resource-put": {
			"url": "/SERVICE-SYSTEM/api/v1/resource",
			"method": "put"
		},
		"deptList-get": {
			"url": "/SERVICE-SYSTEM/api/v1/resource/deptList",
			"method": "get"
		},
		"ids-get": {
			"url": "/SERVICE-SYSTEM/api/v1/resource/ids",
			"method": "get"
		},
		"list-post": {
			"url": "/SERVICE-SYSTEM/api/v1/resource/list",
			"method": "post"
		},
		"ROLE-get": {
			"url": "/SERVICE-SYSTEM/api/v1/resource/menu/role/{ROLE}",
			"method": "get"
		},
		"menuList-get": {
			"url": "/SERVICE-SYSTEM/api/v1/resource/menuList",
			"method": "get"
		},
		"id-delete": {
			"url": "/SERVICE-SYSTEM/api/v1/resource/{id}",
			"method": "delete"
		}
	},
	"data-resource-controller": {
		"data-post": {
			"url": "/SERVICE-SYSTEM/api/v1/resource/data",
			"method": "post"
		},
		"data-put": {
			"url": "/SERVICE-SYSTEM/api/v1/resource/data",
			"method": "put"
		},
		"data-delete": {
			"url": "/SERVICE-SYSTEM/api/v1/resource/data",
			"method": "delete"
		},
		"list-get": {
			"url": "/SERVICE-SYSTEM/api/v1/resource/data/dept/list",
			"method": "get"
		}
	},
	"role-controller": {
		"role-post": {
			"url": "/SERVICE-SYSTEM/api/v1/role",
			"method": "post"
		},
		"role-put": {
			"url": "/SERVICE-SYSTEM/api/v1/role",
			"method": "put"
		},
		"list-get": {
			"url": "/SERVICE-SYSTEM/api/v1/role/list",
			"method": "get"
		},
		"code-delete": {
			"url": "/SERVICE-SYSTEM/api/v1/role/{code}",
			"method": "delete"
		}
	},
	"token-manage-controller": {
		"logout-get": {
			"url": "/SERVICE-SYSTEM/api/v1/token/logout",
			"method": "get"
		},
		"page-get": {
			"url": "/SERVICE-SYSTEM/api/v1/token/page",
			"method": "get"
		},
		"token-delete": {
			"url": "/SERVICE-SYSTEM/api/v1/token/{token}",
			"method": "delete"
		}
	},
	"user-controller": {
		"user-get": {
			"url": "/SERVICE-SYSTEM/api/v1/user",
			"method": "get"
		},
		"user-post": {
			"url": "/SERVICE-SYSTEM/api/v1/user",
			"method": "post"
		},
		"user-put": {
			"url": "/SERVICE-SYSTEM/api/v1/user",
			"method": "put"
		},
		"batch-delete": {
			"url": "/SERVICE-SYSTEM/api/v1/user/batch",
			"method": "delete"
		},
		"designation-put": {
			"url": "/SERVICE-SYSTEM/api/v1/user/designation",
			"method": "put"
		},
		"getById-get": {
			"url": "/SERVICE-SYSTEM/api/v1/user/getById",
			"method": "get"
		},
		"getByName-get": {
			"url": "/SERVICE-SYSTEM/api/v1/user/getByName",
			"method": "get"
		},
		"getList-get": {
			"url": "/SERVICE-SYSTEM/api/v1/user/getList",
			"method": "get"
		},
		"page-get": {
			"url": "/SERVICE-SYSTEM/api/v1/user/page",
			"method": "get"
		},
		"password-put": {
			"url": "/SERVICE-SYSTEM/api/v1/user/password",
			"method": "put"
		},
		"list-get": {
			"url": "/SERVICE-SYSTEM/api/v1/user/resource/list",
			"method": "get"
		},
		"username-delete": {
			"url": "/SERVICE-SYSTEM/api/v1/user/single/{username}",
			"method": "delete"
		},
		"status-put": {
			"url": "/SERVICE-SYSTEM/api/v1/user/status",
			"method": "put"
		},
		"userList-get": {
			"url": "/SERVICE-SYSTEM/api/v1/user/userList",
			"method": "get"
		},
		"roleCode-get": {
			"url": "/SERVICE-SYSTEM/api/v1/user/{roleCode}",
			"method": "get"
		}
	},
	"swagger-config": {
		"csrf-get": {
			"url": "/SERVICE-SYSTEM/csrf",
			"method": "get"
		},
		"csrf-head": {
			"url": "/SERVICE-SYSTEM/csrf",
			"method": "head"
		},
		"csrf-post": {
			"url": "/SERVICE-SYSTEM/csrf",
			"method": "post"
		},
		"csrf-put": {
			"url": "/SERVICE-SYSTEM/csrf",
			"method": "put"
		},
		"csrf-delete": {
			"url": "/SERVICE-SYSTEM/csrf",
			"method": "delete"
		},
		"csrf-options": {
			"url": "/SERVICE-SYSTEM/csrf",
			"method": "options"
		},
		"csrf-patch": {
			"url": "/SERVICE-SYSTEM/csrf",
			"method": "patch"
		}
	},
	"simulated-login-controller": {
		"login-post": {
			"url": "/SERVICE-SYSTEM/simulation/login",
			"method": "post"
		}
	},
	"principal-controller": {
		"userinfo-get": {
			"url": "/SERVICE-SYSTEM/userinfo",
			"method": "get"
		},
		"userlogout-get": {
			"url": "/SERVICE-SYSTEM/userlogout",
			"method": "get"
		}
	}
}