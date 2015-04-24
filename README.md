# AjaxCache
Ajax with optional localStorage as data cache support, based on [jQuery.js](https://github.com/jquery).

## Usage

```javascript
var UserDataAjax = new AjaxCache.extend({
    key: 'app_user_data',
    ajaxParam: {
        url: '/user/data',
        data: {
            userId: '10001'
        },
        dataType: 'JSON'
    }
});

new UserDataAjax().done(function (data) {
    // ...
}).fail(function () {
    // ...
}).getData();

// if ajax success, and client support localStorage, next time will use local cache data
new UserDataAjax().getData(); // do not trigger another ajax
```

## Why?

Old website's not SPA, if get some data every page, it's a little uncomfortable, so I try build something like this, cache some data if client support.

With AjaxCache, I don't need to check if client support localStorage, or if already have cache data, or if cache is too old (epired). Just ```new``` a instance, ```instance.getData()```, and use it like a ```$.ajax()``` result object (Promise Object, with ```.done()```, ```.fail()```, ...).

Is there any advantage compare to HTTP cache?

.... may be none ....

## ???

I'm Chinese, just write README in English for ... fun? ...

So, if there's any mistake/error here, tell me, or forget it! ^_^
