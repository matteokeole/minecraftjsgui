```js
var objectPool = [];
var marker = 0;
var poolSize = 0;

//any old JavaScript object
function commonObject () { }

commonObject.create = function () {
  	if (marker >= poolSize) {
		commonObject.expandPool(poolSize * 2);
	}

	var obj = objectPool[marker++];
	obj.index = marker - 1;
	obj.constructor.apply(obj, arguments);
	return obj;
}

//push new objects onto the pool
commonObject.expandPool = function (newSize) {
	for (var i = 0; i < newSize - poolSize; ++i) {
		objectPool.push(new commonObject());
	}

	poolSize = newSize;
}

//swap it with the last available object
commonObject.prototype.destroy = function () {
	marker--;
	var end = objectPool[marker];
	var endIndex = end.index;

	objectPool[marker] = this;
	objectPool[this.index] = end;

	end.index = this.index;
	this.index = endIndex;
}

//make this as big as you think you need
commonObject.expandPool(1000);
```

Pool 2:
```js
// declare bullet pools
var activeBullets = [];
var bulletPool = [];

// construct some bullets ready for use
for (var i=0; i < 20; i++)
    bulletPool.push( new Bullet() );

// a constructor/factory function
function getNewBullet()
{
    var b = null;

    // check to see if there is a spare one
    if (bulletPool.length > 0)
        b = bulletPool.pop();
    else 
        // none left, construct a new one
        b = new Bullet();	

    // move the new bullet to the active array
    activeBullets.push(b);
    return b;
}

function freeBullet(b)
{
    // find the active bullet and remove it
    // NOTE: Not using indexOf since it wont work in IE8 and below
    for (var i=0, l=activeBullets.length; i < l; i++)
        if (activeBullets[i] == b)
            array.slice(i, 1);
	
    // return the bullet back into the pool
    bulletPool.push(b);
}
```