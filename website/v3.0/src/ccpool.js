cc.pool = {
    _pool: {},
    putInPool: function (obj) {
        if (obj instanceof cc.Node) {
            var pid = obj.constructor.prototype.__pid;
            if (!pid) {
                var desc = { writable: true, enumerable: false, configurable: true };
                desc.value = ClassManager.getNewID();
                Object.defineProperty(obj.constructor.prototype, '__pid', desc);
            }
            if (!this._pool[pid]) {
                this._pool[pid] = [];
            }
            if(obj.unuse)
                obj.unuse();
            obj.retain();//use for jsb
            this._pool[pid].push(obj);
        }
    },
    hasObject: function (objClass) {
        var pid = objClass.prototype.__pid;
        var list = this._pool[pid];
        return (list && list.length > 0);
    },
    removeObject: function (obj) {
        var pid = obj.constructor.prototype.__pid;
        if (pid) {
            var list = this._pool[pid];
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    if (obj === list[i]) {
                        obj.release();
                        list.splice(i, 1);
                    }
                }
            }
        }
    },
    getFromPool: function (objClass) {
        if (this.hasObject(objClass)) {
            var pid = objClass.prototype.__pid;
            var list = this._pool[pid];
            var args = Array.prototype.slice.call(arguments, 1);
            var obj = list.pop();
            if(obj.reuse)
                obj.reuse.apply(obj, args);
            return obj;
        }
    },
    drainAllPools: function () {
        var locPool = this._pool;
        for (var selKey in locPool) {
            for (var j = 0; j < locPool[selKey].length; j++) {
                var obj = locPool[selKey][j];
                if(obj && obj.release)
                    obj.release()
            }
        }
        this._pool = {};
    }
};
