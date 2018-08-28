function jsonTransToPHP(source) {
    let ret = 'array(';
    for (var key in source) {
        const cur = source[key];
        const type = Object.prototype.toString.call(cur);
        switch (type) {
            case '[object String]':
                ret += `'${key}' => '${cur}',`
                break;
            case '[object Number]':
                ret += `'${key}' => ${cur || 0},`
                break;
            case '[object Array]':
                ret += `'${key}' => array(`
                for (var i = 0, len = cur.length; i < len; i++) {
                    ret += jsonTransToPHP(cur[i]);
                }
                ret += '),';
                break;
            case '[object Object]':
                ret += `'${key}' => ${jsonTransToPHP(cur)} ` ;
                break;
        }
    }
    ret += '),';
    return ret;
}

var source = {
    "errno":0,
    "errmsg":"success",
    "data":{
        "errcode":0,
        "msg":"成功",
        "list":[
            {
                "cc":[
                    {
                        "status":112
                    }
                ],
                "status":24,
                "product":{
                    "productid":"JXJ001",
                    "projectid":"JXJ"
                }
            },{
                "cc":[
                    {
                        "status":112
                    }
                ],
                "status":24,
                "product":{
                    "productid":"JXJ001",
                    "projectid":"JXJ"
                }
            }
        ],
        "total":1168749
    }
};

jsonTransToPHP(source);
