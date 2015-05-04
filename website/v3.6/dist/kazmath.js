cc.math=cc.math||{},cc.math.EPSILON=1/64,cc.math.square=function(a){return a*a},cc.math.almostEqual=function(a,b){return a+cc.math.EPSILON>b&&a-cc.math.EPSILON<b},function(a){a.math.Vec2=function(a,b){void 0===b?(this.x=a.x,this.y=a.y):(this.x=a||0,this.y=b||0)};var b=a.math.Vec2.prototype;b.fill=function(a,b){this.x=a,this.y=b},b.length=function(){return Math.sqrt(a.math.square(this.x)+a.math.square(this.y))},b.lengthSq=function(){return a.math.square(this.x)+a.math.square(this.y)},b.normalize=function(){var a=1/this.length();return this.x*=a,this.y*=a,this},a.math.Vec2.add=function(a,b,c){return a.x=b.x+c.x,a.y=b.y+c.y,a},b.add=function(a){return this.x+=a.x,this.y+=a.y,this},b.dot=function(a){return this.x*a.x+this.y*a.y},a.math.Vec2.subtract=function(a,b,c){return a.x=b.x-c.x,a.y=b.y-c.y,a},b.subtract=function(a){return this.x-=a.x,this.y-=a.y,this},b.transform=function(a){var b=this.x,c=this.y;return this.x=b*a.mat[0]+c*a.mat[3]+a.mat[6],this.y=b*a.mat[1]+c*a.mat[4]+a.mat[7],this},a.math.Vec2.scale=function(a,b,c){return a.x=b.x*c,a.y=b.y*c,a},b.scale=function(a){return this.x*=a,this.y*=a,this},b.equals=function(b){return this.x<b.x+a.math.EPSILON&&this.x>b.x-a.math.EPSILON&&this.y<b.y+a.math.EPSILON&&this.y>b.y-a.math.EPSILON}}(cc),function(a){a.kmVec3=a.math.Vec3=function(a,b,c){a&&void 0===b?(this.x=a.x,this.y=a.y,this.z=a.z):(this.x=a||0,this.y=b||0,this.z=c||0)},a.math.vec3=function(b,c,d){return new a.math.Vec3(b,c,d)};var b=a.math.Vec3.prototype;b.fill=function(a,b,c){return a&&void 0===b?(this.x=a.x,this.y=a.y,this.z=a.z):(this.x=a,this.y=b,this.z=c),this},b.length=function(){return Math.sqrt(a.math.square(this.x)+a.math.square(this.y)+a.math.square(this.z))},b.lengthSq=function(){return a.math.square(this.x)+a.math.square(this.y)+a.math.square(this.z)},b.normalize=function(){var a=1/this.length();return this.x*=a,this.y*=a,this.z*=a,this},b.cross=function(a){var b=this.x,c=this.y,d=this.z;return this.x=c*a.z-d*a.y,this.y=d*a.x-b*a.z,this.z=b*a.y-c*a.x,this},b.dot=function(a){return this.x*a.x+this.y*a.y+this.z*a.z},b.add=function(a){return this.x+=a.x,this.y+=a.y,this.z+=a.z,this},b.subtract=function(a){return this.x-=a.x,this.y-=a.y,this.z-=a.z,this},b.transform=function(a){var b=this.x,c=this.y,d=this.z,e=a.mat;return this.x=b*e[0]+c*e[4]+d*e[8]+e[12],this.y=b*e[1]+c*e[5]+d*e[9]+e[13],this.z=b*e[2]+c*e[6]+d*e[10]+e[14],this},b.transformNormal=function(a){var b=this.x,c=this.y,d=this.z,e=a.mat;return this.x=b*e[0]+c*e[4]+d*e[8],this.y=b*e[1]+c*e[5]+d*e[9],this.z=b*e[2]+c*e[6]+d*e[10],this},b.transformCoord=function(b){var c=new a.math.Vec4(this.x,this.y,this.z,1);return c.transform(b),this.x=c.x/c.w,this.y=c.y/c.w,this.z=c.z/c.w,this},b.scale=function(a){return this.x*=a,this.y*=a,this.z*=a,this},b.equals=function(b){var c=a.math.EPSILON;return this.x<b.x+c&&this.x>b.x-c&&this.y<b.y+c&&this.y>b.y-c&&this.z<b.z+c&&this.z>b.z-c},b.inverseTransform=function(b){var c=b.mat,d=new a.math.Vec3(this.x-c[12],this.y-c[13],this.z-c[14]);return this.x=d.x*c[0]+d.y*c[1]+d.z*c[2],this.y=d.x*c[4]+d.y*c[5]+d.z*c[6],this.z=d.x*c[8]+d.y*c[9]+d.z*c[10],this},b.inverseTransformNormal=function(a){var b=this.x,c=this.y,d=this.z,e=a.mat;return this.x=b*e[0]+c*e[1]+d*e[2],this.y=b*e[4]+c*e[5]+d*e[6],this.z=b*e[8]+c*e[9]+d*e[10],this},b.assignFrom=function(a){return a?(this.x=a.x,this.y=a.y,this.z=a.z,this):this},a.math.Vec3.zero=function(a){return a.x=a.y=a.z=0,a},b.toTypeArray=function(){var a=new Float32Array(3);return a[0]=this.x,a[1]=this.y,a[2]=this.z,a}}(cc),function(a){a.math.Vec4=function(a,b,c,d){a&&void 0===b?(this.x=a.x,this.y=a.y,this.z=a.z,this.w=a.w):(this.x=a||0,this.y=b||0,this.z=c||0,this.w=d||0)},a.kmVec4=a.math.Vec4;var b=a.math.Vec4.prototype;b.fill=function(a,b,c,d){a&&void 0===b?(this.x=a.x,this.y=a.y,this.z=a.z,this.w=a.w):(this.x=a,this.y=b,this.z=c,this.w=d)},b.add=function(a){return a?(this.x+=a.x,this.y+=a.y,this.z+=a.z,this.w+=a.w,this):this},b.dot=function(a){return this.x*a.x+this.y*a.y+this.z*a.z+this.w*a.w},b.length=function(){return Math.sqrt(a.math.square(this.x)+a.math.square(this.y)+a.math.square(this.z)+a.math.square(this.w))},b.lengthSq=function(){return a.math.square(this.x)+a.math.square(this.y)+a.math.square(this.z)+a.math.square(this.w)},b.lerp=function(a,b){return this},b.normalize=function(){var a=1/this.length();return this.x*=a,this.y*=a,this.z*=a,this.w*=a,this},b.scale=function(a){return this.normalize(),this.x*=a,this.y*=a,this.z*=a,this.w*=a,this},b.subtract=function(a){this.x-=a.x,this.y-=a.y,this.z-=a.z,this.w-=a.w},b.transform=function(a){var b=this.x,c=this.y,d=this.z,e=this.w,f=a.mat;return this.x=b*f[0]+c*f[4]+d*f[8]+e*f[12],this.y=b*f[1]+c*f[5]+d*f[9]+e*f[13],this.z=b*f[2]+c*f[6]+d*f[10]+e*f[14],this.w=b*f[3]+c*f[7]+d*f[11]+e*f[15],this},a.math.Vec4.transformArray=function(b,c){for(var d=[],e=0;e<b.length;e++){var f=new a.math.Vec4(b[e]);f.transform(c),d.push(f)}return d},b.equals=function(b){var c=a.math.EPSILON;return this.x<b.x+c&&this.x>b.x-c&&this.y<b.y+c&&this.y>b.y-c&&this.z<b.z+c&&this.z>b.z-c&&this.w<b.w+c&&this.w>b.w-c},b.assignFrom=function(a){return this.x=a.x,this.y=a.y,this.z=a.z,this.w=a.w,this},b.toTypeArray=function(){var a=new Float32Array(4);return a[0]=this.x,a[1]=this.y,a[2]=this.z,a[3]=this.w,a}}(cc),function(a){function b(b,c,d){var e=new a.math.Vec2(c);e.subtract(b),d.x=-e.y,d.y=e.x,d.normalize()}a.math.Ray2=function(b,c){this.start=b||new a.math.Vec2,this.dir=c||new a.math.Vec2},a.math.Ray2.prototype.fill=function(a,b,c,d){this.start.x=a,this.start.y=b,this.dir.x=c,this.dir.y=d},a.math.Ray2.prototype.intersectLineSegment=function(b,c,d){var e,f,g,h=this.start.x,i=this.start.y,j=this.start.x+this.dir.x,k=this.start.y+this.dir.y,l=b.x,m=b.y,n=c.x,o=c.y,p=(o-m)*(j-h)-(n-l)*(k-i);return p>-a.math.EPSILON&&p<a.math.EPSILON?!1:(e=((n-l)*(i-m)-(o-m)*(h-l))/p,f=h+e*(j-h),g=i+e*(k-i),f<Math.min(b.x,c.x)-a.math.EPSILON||f>Math.max(b.x,c.x)+a.math.EPSILON||g<Math.min(b.y,c.y)-a.math.EPSILON||g>Math.max(b.y,c.y)+a.math.EPSILON?!1:f<Math.min(h,j)-a.math.EPSILON||f>Math.max(h,j)+a.math.EPSILON||g<Math.min(i,k)-a.math.EPSILON||g>Math.max(i,k)+a.math.EPSILON?!1:(d.x=f,d.y=g,!0))},a.math.Ray2.prototype.intersectTriangle=function(c,d,e,f,g){var h,i=new a.math.Vec2,j=new a.math.Vec2,k=new a.math.Vec2,l=1e4,m=!1;return this.intersectLineSegment(c,d,i)&&(m=!0,h=i.subtract(this.start).length(),l>h&&(j.x=i.x,j.y=i.y,l=h,b(c,d,k))),this.intersectLineSegment(d,e,i)&&(m=!0,h=i.subtract(this.start).length(),l>h&&(j.x=i.x,j.y=i.y,l=h,b(d,e,k))),this.intersectLineSegment(e,c,i)&&(m=!0,h=i.subtract(this.start).length(),l>h&&(j.x=i.x,j.y=i.y,l=h,b(e,c,k))),m&&(f.x=j.x,f.y=j.y,g&&(g.x=k.x,g.y=k.y)),m}}(cc);var Float32Array=Float32Array||Array;!function(a){a.math.Matrix3=function(a){a&&a.mat?this.mat=new Float32Array(a.mat):this.mat=new Float32Array(9)},a.kmMat3=a.math.Matrix3;var b=a.math.Matrix3.prototype;b.fill=function(a){var b=this.mat,c=a.mat;return b[0]=c[0],b[1]=c[1],b[2]=c[2],b[3]=c[3],b[4]=c[4],b[5]=c[5],b[6]=c[6],b[7]=c[7],b[8]=c[8],this},b.adjugate=function(){var a=this.mat,b=a[0],c=a[1],d=a[2],e=a[3],f=a[4],g=a[5],h=a[6],i=a[7],j=a[8];return a[0]=f*j-g*i,a[1]=d*i-c*j,a[2]=c*g-d*f,a[3]=g*h-e*j,a[4]=b*j-d*h,a[5]=d*e-b*g,a[6]=e*i-f*h,a[8]=b*f-c*e,this},b.identity=function(){var a=this.mat;return a[1]=a[2]=a[3]=a[5]=a[6]=a[7]=0,a[0]=a[4]=a[8]=1,this};var c=new a.math.Matrix3;b.inverse=function(a){if(0===a)return this;c.assignFrom(this);var b=1/a;return this.adjugate(),this.multiplyScalar(b),this},b.isIdentity=function(){var a=this.mat;return 1===a[0]&&0===a[1]&&0===a[2]&&0===a[3]&&1===a[4]&&0===a[5]&&0===a[6]&&0===a[7]&&1===a[8]},b.transpose=function(){var a=this.mat,b=a[1],c=a[2],d=a[3],e=a[5],f=a[6],g=a[7];return a[1]=d,a[2]=f,a[3]=b,a[5]=g,a[6]=c,a[7]=e,this},b.determinant=function(){var a=this.mat,b=a[0]*a[4]*a[8]+a[1]*a[5]*a[6]+a[2]*a[3]*a[7];return b-=a[2]*a[4]*a[6]+a[0]*a[5]*a[7]+a[1]*a[3]*a[8]},b.multiply=function(a){var b=this.mat,c=a.mat,d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],i=b[5],j=b[6],k=b[7],l=b[8],m=c[0],n=c[1],o=c[2],p=c[3],q=c[4],r=c[5],s=c[6],t=c[7],u=c[8];return b[0]=d*m+g*n+j*o,b[1]=e*m+h*n+k*o,b[2]=f*m+i*n+l*o,b[3]=f*m+i*n+l*o,b[4]=e*p+h*q+k*r,b[5]=f*p+i*q+l*r,b[6]=d*s+g*t+j*u,b[7]=e*s+h*t+k*u,b[8]=f*s+i*t+l*u,this},b.multiplyScalar=function(a){var b=this.mat;return b[0]*=a,b[1]*=a,b[2]*=a,b[3]*=a,b[4]*=a,b[5]*=a,b[6]*=a,b[7]*=a,b[8]*=a,this},a.math.Matrix3.rotationAxisAngle=function(b,c){var d=Math.cos(c),e=Math.sin(c),f=new a.math.Matrix3,g=f.mat;return g[0]=d+b.x*b.x*(1-d),g[1]=b.z*e+b.y*b.x*(1-d),g[2]=-b.y*e+b.z*b.x*(1-d),g[3]=-b.z*e+b.x*b.y*(1-d),g[4]=d+b.y*b.y*(1-d),g[5]=b.x*e+b.z*b.y*(1-d),g[6]=b.y*e+b.x*b.z*(1-d),g[7]=-b.x*e+b.y*b.z*(1-d),g[8]=d+b.z*b.z*(1-d),f},b.assignFrom=function(b){if(this===b)return a.log("cc.math.Matrix3.assign(): current matrix equals matIn"),this;var c=this.mat,d=b.mat;return c[0]=d[0],c[1]=d[1],c[2]=d[2],c[3]=d[3],c[4]=d[4],c[5]=d[5],c[6]=d[6],c[7]=d[7],c[8]=d[8],this},b.equals=function(b){if(this===b)return!0;for(var c=a.math.EPSILON,d=this.mat,e=b.mat,f=0;9>f;++f)if(!(d[f]+c>e[f]&&d[f]-c<e[f]))return!1;return!0},a.math.Matrix3.createByRotationX=function(b){var c=new a.math.Matrix3,d=c.mat;return d[0]=1,d[1]=0,d[2]=0,d[3]=0,d[4]=Math.cos(b),d[5]=Math.sin(b),d[6]=0,d[7]=-Math.sin(b),d[8]=Math.cos(b),c},a.math.Matrix3.createByRotationY=function(b){var c=new a.math.Matrix3,d=c.mat;return d[0]=Math.cos(b),d[1]=0,d[2]=-Math.sin(b),d[3]=0,d[4]=1,d[5]=0,d[6]=Math.sin(b),d[7]=0,d[8]=Math.cos(b),c},a.math.Matrix3.createByRotationZ=function(b){var c=new a.math.Matrix3,d=c.mat;return d[0]=Math.cos(b),d[1]=-Math.sin(b),d[2]=0,d[3]=Math.sin(b),d[4]=Math.cos(b),d[5]=0,d[6]=0,d[7]=0,d[8]=1,c},a.math.Matrix3.createByRotation=function(b){var c=new a.math.Matrix3,d=c.mat;return d[0]=Math.cos(b),d[1]=Math.sin(b),d[2]=0,d[3]=-Math.sin(b),d[4]=Math.cos(b),d[5]=0,d[6]=0,d[7]=0,d[8]=1,c},a.math.Matrix3.createByScale=function(b,c){var d=new a.math.Matrix3;return d.identity(),d.mat[0]=b,d.mat[4]=c,d},a.math.Matrix3.createByTranslation=function(b,c){var d=new a.math.Matrix3;return d.identity(),d.mat[6]=b,d.mat[7]=c,d},a.math.Matrix3.createByQuaternion=function(b){if(!b)return null;var c=new a.math.Matrix3,d=c.mat;return d[0]=1-2*(b.y*b.y+b.z*b.z),d[1]=2*(b.x*b.y-b.w*b.z),d[2]=2*(b.x*b.z+b.w*b.y),d[3]=2*(b.x*b.y+b.w*b.z),d[4]=1-2*(b.x*b.x+b.z*b.z),d[5]=2*(b.y*b.z-b.w*b.x),d[6]=2*(b.x*b.z-b.w*b.y),d[7]=2*(b.y*b.z+b.w*b.x),d[8]=1-2*(b.x*b.x+b.y*b.y),c},b.rotationToAxisAngle=function(){return a.math.Quaternion.rotationMatrix(this).toAxisAndAngle()}}(cc),function(a){a.math.Matrix4=function(a){a&&a.mat?this.mat=new Float32Array(a.mat):this.mat=new Float32Array(16)},a.kmMat4=a.math.Matrix4;var b=a.math.Matrix4.prototype;b.fill=function(a){for(var b=this.mat,c=0;16>c;c++)b[c]=a[c];return this},a.kmMat4Identity=function(a){var b=a.mat;return b[1]=b[2]=b[3]=b[4]=b[6]=b[7]=b[8]=b[9]=b[11]=b[12]=b[13]=b[14]=0,b[0]=b[5]=b[10]=b[15]=1,a},b.identity=function(){var a=this.mat;return a[1]=a[2]=a[3]=a[4]=a[6]=a[7]=a[8]=a[9]=a[11]=a[12]=a[13]=a[14]=0,a[0]=a[5]=a[10]=a[15]=1,this},b.get=function(a,b){return this.mat[a+4*b]},b.set=function(a,b,c){this.mat[a+4*b]=c},b.swap=function(a,b,c,d){var e=this.mat,f=e[a+4*b];e[a+4*b]=e[c+4*d],e[c+4*d]=f},a.math.Matrix4._gaussj=function(a,b){var c,d,e,f,g,h,i,j,k,l=0,m=0,n=4,o=4,p=[0,0,0,0],q=[0,0,0,0],r=[0,0,0,0];for(c=0;n>c;c++){for(i=0,d=0;n>d;d++)if(1!==r[d])for(e=0;n>e;e++)0===r[e]&&(h=Math.abs(a.get(d,e)),h>=i&&(i=h,m=d,l=e));if(++r[l],m!==l){for(f=0;n>f;f++)a.swap(m,f,l,f);for(f=0;o>f;f++)b.swap(m,f,l,f)}if(q[c]=m,p[c]=l,0===a.get(l,l))return!1;for(k=1/a.get(l,l),a.set(l,l,1),f=0;n>f;f++)a.set(l,f,a.get(l,f)*k);for(f=0;o>f;f++)b.set(l,f,b.get(l,f)*k);for(g=0;n>g;g++)if(g!==l){for(j=a.get(g,l),a.set(g,l,0),f=0;n>f;f++)a.set(g,f,a.get(g,f)-a.get(l,f)*j);for(f=0;o>f;f++)b.set(g,f,a.get(g,f)-b.get(l,f)*j)}}for(f=n-1;f>=0;f--)if(q[f]!==p[f])for(e=0;n>e;e++)a.swap(e,q[f],e,p[f]);return!0};var c=(new a.math.Matrix4).identity();a.kmMat4Inverse=function(b,d){var e=new a.math.Matrix4(d);return a.math.Matrix4._gaussj(e,c)===!1?null:(b.assignFrom(e),b)},b.inverse=function(){var b=new a.math.Matrix4(this);return a.math.Matrix4._gaussj(b,c)===!1?null:b},b.isIdentity=function(){var a=this.mat;return 1===a[0]&&0===a[1]&&0===a[2]&&0===a[3]&&0===a[4]&&1===a[5]&&0===a[6]&&0===a[7]&&0===a[8]&&0===a[9]&&1===a[10]&&0===a[11]&&0===a[12]&&0===a[13]&&0===a[14]&&1===a[15]},b.transpose=function(){var a=this.mat,b=a[1],c=a[2],d=a[3],e=a[4],f=a[6],g=a[7],h=a[8],i=a[9],j=a[11],k=a[12],l=a[13],m=a[14];return a[1]=e,a[2]=h,a[3]=k,a[4]=b,a[6]=i,a[7]=l,a[8]=c,a[9]=f,a[11]=m,a[12]=d,a[13]=g,a[14]=j,this},a.kmMat4Multiply=function(a,b,c){var d=a.mat,e=b.mat,f=c.mat,g=e[0],h=e[1],i=e[2],j=e[3],k=e[4],l=e[5],m=e[6],n=e[7],o=e[8],p=e[9],q=e[10],r=e[11],s=e[12],t=e[13],u=e[14],v=e[15],w=f[0],x=f[1],y=f[2],z=f[3],A=f[4],B=f[5],C=f[6],D=f[7],E=f[8],F=f[9],G=f[10],H=f[11],I=f[12],J=f[13],K=f[14],L=f[15];return d[0]=w*g+x*k+y*o+z*s,d[1]=w*h+x*l+y*p+z*t,d[2]=w*i+x*m+y*q+z*u,d[3]=w*j+x*n+y*r+z*v,d[4]=A*g+B*k+C*o+D*s,d[5]=A*h+B*l+C*p+D*t,d[6]=A*i+B*m+C*q+D*u,d[7]=A*j+B*n+C*r+D*v,d[8]=E*g+F*k+G*o+H*s,d[9]=E*h+F*l+G*p+H*t,d[10]=E*i+F*m+G*q+H*u,d[11]=E*j+F*n+G*r+H*v,d[12]=I*g+J*k+K*o+L*s,d[13]=I*h+J*l+K*p+L*t,d[14]=I*i+J*m+K*q+L*u,d[15]=I*j+J*n+K*r+L*v,a},b.multiply=function(a){var b=this.mat,c=a.mat,d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],i=b[5],j=b[6],k=b[7],l=b[8],m=b[9],n=b[10],o=b[11],p=b[12],q=b[13],r=b[14],s=b[15],t=c[0],u=c[1],v=c[2],w=c[3],x=c[4],y=c[5],z=c[6],A=c[7],B=c[8],C=c[9],D=c[10],E=c[11],F=c[12],G=c[13],H=c[14],I=c[15];return b[0]=t*d+u*h+v*l+w*p,b[1]=t*e+u*i+v*m+w*q,b[2]=t*f+u*j+v*n+w*r,b[3]=t*g+u*k+v*o+w*s,b[4]=x*d+y*h+z*l+A*p,b[5]=x*e+y*i+z*m+A*q,b[6]=x*f+y*j+z*n+A*r,b[7]=x*g+y*k+z*o+A*s,b[8]=B*d+C*h+D*l+E*p,b[9]=B*e+C*i+D*m+E*q,b[10]=B*f+C*j+D*n+E*r,b[11]=B*g+C*k+D*o+E*s,b[12]=F*d+G*h+H*l+I*p,b[13]=F*e+G*i+H*m+I*q,b[14]=F*f+G*j+H*n+I*r,b[15]=F*g+G*k+H*o+I*s,this},a.getMat4MultiplyValue=function(a,b){var c=a.mat,d=b.mat,e=new Float32Array(16);return e[0]=c[0]*d[0]+c[4]*d[1]+c[8]*d[2]+c[12]*d[3],e[1]=c[1]*d[0]+c[5]*d[1]+c[9]*d[2]+c[13]*d[3],e[2]=c[2]*d[0]+c[6]*d[1]+c[10]*d[2]+c[14]*d[3],e[3]=c[3]*d[0]+c[7]*d[1]+c[11]*d[2]+c[15]*d[3],e[4]=c[0]*d[4]+c[4]*d[5]+c[8]*d[6]+c[12]*d[7],e[5]=c[1]*d[4]+c[5]*d[5]+c[9]*d[6]+c[13]*d[7],e[6]=c[2]*d[4]+c[6]*d[5]+c[10]*d[6]+c[14]*d[7],e[7]=c[3]*d[4]+c[7]*d[5]+c[11]*d[6]+c[15]*d[7],e[8]=c[0]*d[8]+c[4]*d[9]+c[8]*d[10]+c[12]*d[11],e[9]=c[1]*d[8]+c[5]*d[9]+c[9]*d[10]+c[13]*d[11],e[10]=c[2]*d[8]+c[6]*d[9]+c[10]*d[10]+c[14]*d[11],e[11]=c[3]*d[8]+c[7]*d[9]+c[11]*d[10]+c[15]*d[11],e[12]=c[0]*d[12]+c[4]*d[13]+c[8]*d[14]+c[12]*d[15],e[13]=c[1]*d[12]+c[5]*d[13]+c[9]*d[14]+c[13]*d[15],e[14]=c[2]*d[12]+c[6]*d[13]+c[10]*d[14]+c[14]*d[15],e[15]=c[3]*d[12]+c[7]*d[13]+c[11]*d[14]+c[15]*d[15],e},a.kmMat4Assign=function(b,c){if(b===c)return a.log("cc.kmMat4Assign(): pOut equals pIn"),b;var d=b.mat,e=c.mat;return d[0]=e[0],d[1]=e[1],d[2]=e[2],d[3]=e[3],d[4]=e[4],d[5]=e[5],d[6]=e[6],d[7]=e[7],d[8]=e[8],d[9]=e[9],d[10]=e[10],d[11]=e[11],d[12]=e[12],d[13]=e[13],d[14]=e[14],d[15]=e[15],b},b.assignFrom=function(b){if(this===b)return a.log("cc.mat.Matrix4.assignFrom(): mat4 equals current matrix"),this;var c=this.mat,d=b.mat;return c[0]=d[0],c[1]=d[1],c[2]=d[2],c[3]=d[3],c[4]=d[4],c[5]=d[5],c[6]=d[6],c[7]=d[7],c[8]=d[8],c[9]=d[9],c[10]=d[10],c[11]=d[11],c[12]=d[12],c[13]=d[13],c[14]=d[14],c[15]=d[15],this},b.equals=function(b){if(this===b)return a.log("cc.kmMat4AreEqual(): pMat1 and pMat2 are same object."),!0;for(var c=this.mat,d=b.mat,e=a.math.EPSILON,f=0;16>f;f++)if(!(c[f]+e>d[f]&&c[f]-e<d[f]))return!1;return!0},a.math.Matrix4.createByRotationX=function(b,c){c=c||new a.math.Matrix4;var d=c.mat;return d[0]=1,d[3]=d[2]=d[1]=0,d[4]=0,d[5]=Math.cos(b),d[6]=Math.sin(b),d[7]=0,d[8]=0,d[9]=-Math.sin(b),d[10]=Math.cos(b),d[11]=0,d[14]=d[13]=d[12]=0,d[15]=1,c},a.math.Matrix4.createByRotationY=function(b,c){c=c||new a.math.Matrix4;var d=c.mat;return d[0]=Math.cos(b),d[1]=0,d[2]=-Math.sin(b),d[3]=0,d[7]=d[6]=d[4]=0,d[5]=1,d[8]=Math.sin(b),d[9]=0,d[10]=Math.cos(b),d[11]=0,d[14]=d[13]=d[12]=0,d[15]=1,c},a.math.Matrix4.createByRotationZ=function(b,c){c=c||new a.math.Matrix4;var d=c.mat;return d[0]=Math.cos(b),d[1]=Math.sin(b),d[3]=d[2]=0,d[4]=-Math.sin(b),d[5]=Math.cos(b),d[7]=d[6]=0,d[11]=d[9]=d[8]=0,d[10]=1,d[14]=d[13]=d[12]=0,d[15]=1,c},a.math.Matrix4.createByPitchYawRoll=function(b,c,d,e){e=e||new a.math.Matrix4;var f=Math.cos(b),g=Math.sin(b),h=Math.cos(c),i=Math.sin(c),j=Math.cos(d),k=Math.sin(d),l=g*i,m=f*i,n=e.mat;return n[0]=h*j,n[4]=h*k,n[8]=-i,n[1]=l*j-f*k,n[5]=l*k+f*j,n[9]=g*h,n[2]=m*j+g*k,n[6]=m*k-g*j,n[10]=f*h,n[3]=n[7]=n[11]=0,n[15]=1,e},a.math.Matrix4.createByQuaternion=function(b,c){c=c||new a.math.Matrix4;var d=c.mat;return d[0]=1-2*(b.y*b.y+b.z*b.z),d[1]=2*(b.x*b.y+b.z*b.w),d[2]=2*(b.x*b.z-b.y*b.w),d[3]=0,d[4]=2*(b.x*b.y-b.z*b.w),d[5]=1-2*(b.x*b.x+b.z*b.z),d[6]=2*(b.z*b.y+b.x*b.w),d[7]=0,d[8]=2*(b.x*b.z+b.y*b.w),d[9]=2*(b.y*b.z-b.x*b.w),d[10]=1-2*(b.x*b.x+b.y*b.y),d[11]=0,d[14]=d[13]=d[12]=0,d[15]=1,c},a.math.Matrix4.createByRotationTranslation=function(b,c,d){d=d||new a.math.Matrix4;var e=d.mat,f=b.mat;return e[0]=f[0],e[1]=f[1],e[2]=f[2],e[3]=0,e[4]=f[3],e[5]=f[4],e[6]=f[5],e[7]=0,e[8]=f[6],e[9]=f[7],e[10]=f[8],e[11]=0,e[12]=c.x,e[13]=c.y,e[14]=c.z,e[15]=1,d},a.math.Matrix4.createByScale=function(b,c,d,e){e=e||new a.math.Matrix4;var f=e.mat;return f[0]=b,f[5]=c,f[10]=d,f[15]=1,f[1]=f[2]=f[3]=f[4]=f[6]=f[7]=f[8]=f[9]=f[11]=f[12]=f[13]=f[14]=0,e},a.kmMat4Translation=function(a,b,c,d){return a.mat[0]=a.mat[5]=a.mat[10]=a.mat[15]=1,a.mat[1]=a.mat[2]=a.mat[3]=a.mat[4]=a.mat[6]=a.mat[7]=a.mat[8]=a.mat[9]=a.mat[11]=0,a.mat[12]=b,a.mat[13]=c,a.mat[14]=d,a},a.math.Matrix4.createByTranslation=function(b,c,d,e){return e=e||new a.math.Matrix4,e.identity(),e.mat[12]=b,e.mat[13]=c,e.mat[14]=d,e},b.getUpVec3=function(){var b=this.mat,c=new a.math.Vec3(b[4],b[5],b[6]);return c.normalize()},b.getRightVec3=function(){var b=this.mat,c=new a.math.Vec3(b[0],b[1],b[2]);return c.normalize()},b.getForwardVec3=function(){var b=this.mat,c=new a.math.Vec3(b[8],b[9],b[10]);return c.normalize()},a.kmMat4PerspectiveProjection=function(b,c,d,e,f){var g=a.degreesToRadians(c/2),h=f-e,i=Math.sin(g);if(0===h||0===i||0===d)return null;var j=Math.cos(g)/i;return b.identity(),b.mat[0]=j/d,b.mat[5]=j,b.mat[10]=-(f+e)/h,b.mat[11]=-1,b.mat[14]=-2*e*f/h,b.mat[15]=0,b},a.math.Matrix4.createPerspectiveProjection=function(b,c,d,e){var f=a.degreesToRadians(b/2),g=e-d,h=Math.sin(f);if(0===g||0===h||0===c)return null;var i=Math.cos(f)/h,j=new a.math.Matrix4,k=j.mat;return j.identity(),k[0]=i/c,k[5]=i,k[10]=-(e+d)/g,k[11]=-1,k[14]=-2*d*e/g,k[15]=0,j},a.kmMat4OrthographicProjection=function(a,b,c,d,e,f,g){return a.identity(),a.mat[0]=2/(c-b),a.mat[5]=2/(e-d),a.mat[10]=-2/(g-f),a.mat[12]=-((c+b)/(c-b)),a.mat[13]=-((e+d)/(e-d)),a.mat[14]=-((g+f)/(g-f)),a},a.math.Matrix4.createOrthographicProjection=function(b,c,d,e,f,g){var h=new a.math.Matrix4,i=h.mat;return h.identity(),i[0]=2/(c-b),i[5]=2/(e-d),i[10]=-2/(g-f),i[12]=-((c+b)/(c-b)),i[13]=-((e+d)/(e-d)),i[14]=-((g+f)/(g-f)),h},a.kmMat4LookAt=function(b,c,d,e){var f=new a.math.Vec3(d),g=new a.math.Vec3(e);f.subtract(c),f.normalize(),g.normalize();var h=new a.math.Vec3(f);h.cross(g),h.normalize();var i=new a.math.Vec3(h);i.cross(f),h.normalize(),b.identity(),b.mat[0]=h.x,b.mat[4]=h.y,b.mat[8]=h.z,b.mat[1]=i.x,b.mat[5]=i.y,b.mat[9]=i.z,b.mat[2]=-f.x,b.mat[6]=-f.y,b.mat[10]=-f.z;var j=a.math.Matrix4.createByTranslation(-c.x,-c.y,-c.z);return b.multiply(j),b};var d=new a.math.Matrix4;b.lookAt=function(b,c,e){var f=new a.math.Vec3(c),g=new a.math.Vec3(e),h=this.mat;f.subtract(b),f.normalize(),g.normalize();var i=new a.math.Vec3(f);i.cross(g),i.normalize();var j=new a.math.Vec3(i);return j.cross(f),i.normalize(),this.identity(),h[0]=i.x,h[4]=i.y,h[8]=i.z,h[1]=j.x,h[5]=j.y,h[9]=j.z,h[2]=-f.x,h[6]=-f.y,h[10]=-f.z,d=a.math.Matrix4.createByTranslation(-b.x,-b.y,-b.z,d),this.multiply(d),this},a.kmMat4RotationAxisAngle=function(b,c,d){var e=Math.cos(d),f=Math.sin(d),g=new a.math.Vec3(c);return g.normalize(),b.mat[0]=e+g.x*g.x*(1-e),b.mat[1]=g.z*f+g.y*g.x*(1-e),b.mat[2]=-g.y*f+g.z*g.x*(1-e),b.mat[3]=0,b.mat[4]=-g.z*f+g.x*g.y*(1-e),b.mat[5]=e+g.y*g.y*(1-e),b.mat[6]=g.x*f+g.z*g.y*(1-e),b.mat[7]=0,b.mat[8]=g.y*f+g.x*g.z*(1-e),b.mat[9]=-g.x*f+g.y*g.z*(1-e),b.mat[10]=e+g.z*g.z*(1-e),b.mat[11]=0,b.mat[12]=0,b.mat[13]=0,b.mat[14]=0,b.mat[15]=1,b},a.math.Matrix4.createByAxisAndAngle=function(b,c,d){d=d||new a.math.Matrix4;var e=this.mat,f=Math.cos(c),g=Math.sin(c),h=new a.math.Vec3(b);return h.normalize(),e[0]=f+h.x*h.x*(1-f),e[1]=h.z*g+h.y*h.x*(1-f),e[2]=-h.y*g+h.z*h.x*(1-f),e[3]=0,e[4]=-h.z*g+h.x*h.y*(1-f),e[5]=f+h.y*h.y*(1-f),e[6]=h.x*g+h.z*h.y*(1-f),e[7]=0,e[8]=h.y*g+h.x*h.z*(1-f),e[9]=-h.x*g+h.y*h.z*(1-f),e[10]=f+h.z*h.z*(1-f),e[11]=0,e[12]=e[13]=e[14]=0,e[15]=1,d},b.extractRotation=function(){var b=new a.math.Matrix3,c=this.mat,d=b.mat;return d[0]=c[0],d[1]=c[1],d[2]=c[2],d[3]=c[4],d[4]=c[5],d[5]=c[6],d[6]=c[8],d[7]=c[9],d[8]=c[10],b},b.extractPlane=function(b){var c=new a.math.Plane,d=this.mat;switch(b){case a.math.Plane.RIGHT:c.a=d[3]-d[0],c.b=d[7]-d[4],c.c=d[11]-d[8],c.d=d[15]-d[12];break;case a.math.Plane.LEFT:c.a=d[3]+d[0],c.b=d[7]+d[4],c.c=d[11]+d[8],c.d=d[15]+d[12];break;case a.math.Plane.BOTTOM:c.a=d[3]+d[1],c.b=d[7]+d[5],c.c=d[11]+d[9],c.d=d[15]+d[13];break;case a.math.Plane.TOP:c.a=d[3]-d[1],c.b=d[7]-d[5],c.c=d[11]-d[9],c.d=d[15]-d[13];break;case a.math.Plane.FAR:c.a=d[3]-d[2],c.b=d[7]-d[6],c.c=d[11]-d[10],c.d=d[15]-d[14];break;case a.math.Plane.NEAR:c.a=d[3]+d[2],c.b=d[7]+d[6],c.c=d[11]+d[10],c.d=d[15]+d[14];break;default:a.log("cc.math.Matrix4.extractPlane: Invalid plane index")}var e=Math.sqrt(c.a*c.a+c.b*c.b+c.c*c.c);return c.a/=e,c.b/=e,c.c/=e,c.d/=e,c},b.toAxisAndAngle=function(){var b=this.extractRotation(),c=a.math.Quaternion.rotationMatrix(b);return c.toAxisAndAngle()}}(cc),function(a){a.math.Plane=function(a,b,c,d){a&&void 0===b?(this.a=a.a,this.b=a.b,this.c=a.c,this.d=a.d):(this.a=a||0,this.b=b||0,this.c=c||0,this.d=d||0)},a.kmPlane=a.math.Plane;var b=a.math.Plane.prototype;a.math.Plane.LEFT=0,a.math.Plane.RIGHT=1,a.math.Plane.BOTTOM=2,a.math.Plane.TOP=3,a.math.Plane.NEAR=4,a.math.Plane.FAR=5,a.math.Plane.POINT_INFRONT_OF_PLANE=0,a.math.Plane.POINT_BEHIND_PLANE=1,a.math.Plane.POINT_ON_PLANE=2,b.dot=function(a){return this.a*a.x+this.b*a.y+this.c*a.z+this.d*a.w},b.dotCoord=function(a){return this.a*a.x+this.b*a.y+this.c*a.z+this.d},b.dotNormal=function(a){return this.a*a.x+this.b*a.y+this.c*a.z},a.math.Plane.fromPointNormal=function(b,c){return new a.math.Plane(c.x,c.y,c.z,-c.dot(b))},a.math.Plane.fromPoints=function(b,c,d){var e=new a.math.Vec3(c),f=new a.math.Vec3(d),g=new a.math.Plane;return e.subtract(b),f.subtract(b),e.cross(f),e.normalize(),g.a=e.x,g.b=e.y,g.c=e.z,g.d=e.scale(-1).dot(b),g},b.normalize=function(){var b=new a.math.Vec3(this.a,this.b,this.c),c=1/b.length();return b.normalize(),this.a=b.x,this.b=b.y,this.c=b.z,this.d=this.d*c,this},b.classifyPoint=function(b){var c=this.a*b.x+this.b*b.y+this.c*b.z+this.d;return c>.001?a.math.Plane.POINT_INFRONT_OF_PLANE:-.001>c?a.math.Plane.POINT_BEHIND_PLANE:a.math.Plane.POINT_ON_PLANE}}(cc),function(a){a.math.Quaternion=function(a,b,c,d){a&&void 0===b?(this.x=a.x,this.y=a.y,this.z=a.z,this.w=a.w):(this.x=a||0,this.y=b||0,this.z=c||0,this.w=d||0)},a.kmQuaternion=a.math.Quaternion;var b=a.math.Quaternion.prototype;b.conjugate=function(a){return this.x=-a.x,this.y=-a.y,this.z=-a.z,this.w=a.w,this},b.dot=function(a){return this.w*a.w+this.x*a.x+this.y*a.y+this.z*a.z},b.exponential=function(){return this},b.identity=function(){return this.x=0,this.y=0,this.z=0,this.w=1,this},b.inverse=function(){var b=this.length();return Math.abs(b)>a.math.EPSILON?(this.x=0,this.y=0,this.z=0,this.w=0,this):(this.conjugate(this).scale(1/b),this)},b.isIdentity=function(){return 0===this.x&&0===this.y&&0===this.z&&1===this.w},b.length=function(){return Math.sqrt(this.lengthSq())},b.lengthSq=function(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w},b.multiply=function(a){var b=this.x,c=this.y,d=this.z,e=this.w;return this.w=e*a.w-b*a.x-c*a.y-d*a.z,this.x=e*a.x+b*a.w+c*a.z-d*a.y,this.y=e*a.y+c*a.w+d*a.x-b*a.z,this.z=e*a.z+d*a.w+b*a.y-c*a.x,this},b.normalize=function(){var b=this.length();if(Math.abs(b)<=a.math.EPSILON)throw"current quaternion is an invalid value";return this.scale(1/b),this},b.rotationAxis=function(a,b){var c=.5*b,d=Math.sin(c);return this.w=Math.cos(c),this.x=a.x*d,this.y=a.y*d,this.z=a.z*d,this},a.math.Quaternion.rotationMatrix=function(b){if(!b)return null;var c,d,e,f,g=[],h=b.mat,i=0;g[0]=h[0],g[1]=h[3],g[2]=h[6],g[4]=h[1],g[5]=h[4],g[6]=h[7],g[8]=h[2],g[9]=h[5],g[10]=h[8],g[15]=1;var j=g[0],k=j[0]+j[5]+j[10]+1;return k>a.math.EPSILON?(i=2*Math.sqrt(k),c=(j[9]-j[6])/i,d=(j[2]-j[8])/i,e=(j[4]-j[1])/i,f=.25*i):j[0]>j[5]&&j[0]>j[10]?(i=2*Math.sqrt(1+j[0]-j[5]-j[10]),c=.25*i,d=(j[4]+j[1])/i,e=(j[2]+j[8])/i,f=(j[9]-j[6])/i):j[5]>j[10]?(i=2*Math.sqrt(1+j[5]-j[0]-j[10]),c=(j[4]+j[1])/i,d=.25*i,e=(j[9]+j[6])/i,f=(j[2]-j[8])/i):(i=2*Math.sqrt(1+j[10]-j[0]-j[5]),c=(j[2]+j[8])/i,d=(j[9]+j[6])/i,e=.25*i,f=(j[4]-j[1])/i),new a.math.Quaternion(c,d,e,f)},a.math.Quaternion.rotationYawPitchRoll=function(b,c,d){var e,f,g,h,i,j,k,l,m,n,o;e=a.degreesToRadians(c)/2,f=a.degreesToRadians(b)/2,g=a.degreesToRadians(d)/2,h=Math.cos(e),i=Math.cos(f),j=Math.cos(g),k=Math.sin(e),l=Math.sin(f),m=Math.sin(g),n=i*j,o=l*m;var p=new a.math.Quaternion;return p.w=h*n+k*o,p.x=k*n-h*o,p.y=h*l*j+k*i*m,p.z=h*i*m-k*l*j,p.normalize(),p},b.slerp=function(b,c){if(this.x===b.x&&this.y===b.y&&this.z===b.z&&this.w===b.w)return this;var d=this.dot(b),e=Math.acos(d),f=Math.sqrt(1-a.math.square(d)),g=Math.sin(c*e)/f,h=Math.sin((1-c)*e)/f,i=new a.math.Quaternion(b);return this.scale(h),i.scale(g),this.add(i),this},b.toAxisAndAngle=function(){var b,c,d,e=new a.math.Vec3;return b=Math.acos(this.w),c=Math.sqrt(a.math.square(this.x)+a.math.square(this.y)+a.math.square(this.z)),c>-a.math.EPSILON&&c<a.math.EPSILON||c<2*Math.PI+a.math.EPSILON&&c>2*Math.PI-a.math.EPSILON?(d=0,e.x=0,e.y=0,e.z=1):(d=2*b,e.x=this.x/c,e.y=this.y/c,e.z=this.z/c,e.normalize()),{axis:e,angle:d}},b.scale=function(a){return this.x*=a,this.y*=a,this.z*=a,this.w*=a,this},b.assignFrom=function(a){return this.x=a.x,this.y=a.y,this.z=a.z,this.w=a.w,this},b.add=function(a){return this.x+=a.x,this.y+=a.y,this.z+=a.z,this.w+=a.w,this},a.math.Quaternion.rotationBetweenVec3=function(b,c,d){var e=new a.math.Vec3(b),f=new a.math.Vec3(c);e.normalize(),f.normalize();var g=e.dot(f),h=new a.math.Quaternion;if(g>=1)return h.identity(),h;if(1e-6-1>g)if(Math.abs(d.lengthSq())<a.math.EPSILON)h.rotationAxis(d,Math.PI);else{var i=new a.math.Vec3(1,0,0);i.cross(b),Math.abs(i.lengthSq())<a.math.EPSILON&&(i.fill(0,1,0),i.cross(b)),i.normalize(),h.rotationAxis(i,Math.PI)}else{var j=Math.sqrt(2*(1+g)),k=1/j;e.cross(f),h.x=e.x*k,h.y=e.y*k,h.z=e.z*k,h.w=.5*j,h.normalize()}return h},b.multiplyVec3=function(b){var c=this.x,d=this.y,e=this.z,f=new a.math.Vec3(b),g=new a.math.Vec3(c,d,e),h=new a.math.Vec3(c,d,e);return g.cross(b),h.cross(g),g.scale(2*q.w),h.scale(2),f.add(g),f.add(h),f}}(cc),cc.math.AABB=function(a,b){this.min=a||new cc.math.Vec3,this.max=b||new cc.math.Vec3},cc.math.AABB.prototype.containsPoint=function(a){return a.x>=this.min.x&&a.x<=this.max.x&&a.y>=this.min.y&&a.y<=this.max.y&&a.z>=this.min.z&&a.z<=this.max.z},cc.math.AABB.containsPoint=function(a,b){return a.x>=b.min.x&&a.x<=b.max.x&&a.y>=b.min.y&&a.y<=b.max.y&&a.z>=b.min.z&&a.z<=b.max.z},cc.math.AABB.prototype.assignFrom=function(a){this.min.assignFrom(a.min),this.max.assignFrom(a.max)},cc.math.AABB.assign=function(a,b){return a.min.assignFrom(b.min),a.max.assignFrom(b.max),a},function(a){a.math.Matrix4Stack=function(a,b){this.top=a,this.stack=b||[]},a.km_mat4_stack=a.math.Matrix4Stack;var b=a.math.Matrix4Stack.prototype;b.initialize=function(){this.stack.length=0,this.top=null},a.km_mat4_stack_push=function(b,c){b.stack.push(b.top),b.top=new a.math.Matrix4(c)},a.km_mat4_stack_pop=function(a,b){a.top=a.stack.pop()},a.km_mat4_stack_release=function(a){a.stack=null,a.top=null},b.push=function(b){b=b||this.top,this.stack.push(this.top),this.top=new a.math.Matrix4(b)},b.pop=function(){this.top=this.stack.pop()},b.release=function(){this.stack=null,this.top=null,this._matrixPool=null},b._getFromPool=function(b){var c=this._matrixPool;if(0===c.length)return new a.math.Matrix4(b);var d=c.pop();return d.assignFrom(b),d},b._putInPool=function(a){this._matrixPool.push(a)}}(cc),function(a){a.KM_GL_MODELVIEW=5888,a.KM_GL_PROJECTION=5889,a.KM_GL_TEXTURE=5890,a.modelview_matrix_stack=new a.math.Matrix4Stack,a.projection_matrix_stack=new a.math.Matrix4Stack,a.texture_matrix_stack=new a.math.Matrix4Stack,a.current_stack=null;var b=!1;a.lazyInitialize=function(){if(!b){var c=new a.math.Matrix4;a.modelview_matrix_stack.initialize(),a.projection_matrix_stack.initialize(),a.texture_matrix_stack.initialize(),a.current_stack=a.modelview_matrix_stack,a.initialized=!0,c.identity(),a.modelview_matrix_stack.push(c),a.projection_matrix_stack.push(c),a.texture_matrix_stack.push(c)}},a.lazyInitialize(),a.kmGLFreeAll=function(){a.modelview_matrix_stack.release(),a.modelview_matrix_stack=null,a.projection_matrix_stack.release(),a.projection_matrix_stack=null,a.texture_matrix_stack.release(),a.texture_matrix_stack=null,a.initialized=!1,a.current_stack=null},a.kmGLPushMatrix=function(){a.current_stack.push(a.current_stack.top)},a.kmGLPushMatrixWitMat4=function(b){a.current_stack.stack.push(a.current_stack.top),b.assignFrom(a.current_stack.top),a.current_stack.top=b},a.kmGLPopMatrix=function(){a.current_stack.top=a.current_stack.stack.pop()},a.kmGLMatrixMode=function(b){switch(b){case a.KM_GL_MODELVIEW:a.current_stack=a.modelview_matrix_stack;break;case a.KM_GL_PROJECTION:a.current_stack=a.projection_matrix_stack;break;case a.KM_GL_TEXTURE:a.current_stack=a.texture_matrix_stack;break;default:throw"Invalid matrix mode specified"}},a.kmGLLoadIdentity=function(){a.current_stack.top.identity()},a.kmGLLoadMatrix=function(b){a.current_stack.top.assignFrom(b)},a.kmGLMultMatrix=function(b){a.current_stack.top.multiply(b)};var c=new a.math.Matrix4;a.kmGLTranslatef=function(b,d,e){var f=a.math.Matrix4.createByTranslation(b,d,e,c);a.current_stack.top.multiply(f)};var d=new a.math.Vec3;a.kmGLRotatef=function(b,e,f,g){d.fill(e,f,g);var h=a.math.Matrix4.createByAxisAndAngle(d,a.degreesToRadians(b),c);a.current_stack.top.multiply(h)},a.kmGLScalef=function(b,d,e){var f=a.math.Matrix4.createByScale(b,d,e,c);a.current_stack.top.multiply(f)},a.kmGLGetMatrix=function(b,c){switch(b){case a.KM_GL_MODELVIEW:c.assignFrom(a.modelview_matrix_stack.top);break;case a.KM_GL_PROJECTION:c.assignFrom(a.projection_matrix_stack.top);break;case a.KM_GL_TEXTURE:c.assignFrom(a.texture_matrix_stack.top);break;default:throw"Invalid matrix mode specified"}}}(cc);