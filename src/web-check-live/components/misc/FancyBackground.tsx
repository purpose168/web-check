// ==================== 导入依赖模块 ====================
import { useEffect, useMemo } from "react";  // React Hooks：useEffect 用于副作用，useMemo 用于性能优化

// ==================== 粒子背景动画组件 ====================
// 使用 Canvas 创建动态粒子背景效果，粒子在网格上移动并形成视觉图案
const FancyBackground = (): JSX.Element => {
  
  // ==================== 设置元素绝对定位 ====================
  // 将元素设置为绝对定位，使其固定在左上角
  const makeAbsolute = (elem: HTMLElement) => {
    elem.style.position = 'absolute';
    elem.style.top = '0';
    elem.style.left = '0';
  };

  // ==================== 查找数组中最大值的元素 ====================
  // 根据字段值和随机因子查找数组中的最大值元素
  const maxBy = (array: any) => {
    const chaos = 30;  // 混乱因子，增加随机性
    const iteratee = (e: any) => e.field + chaos * Math.random();  // 迭代函数
    let result;
    if (array == null) { return result; }
    let computed;
    for (const value of array) {
      const current = iteratee(value);
      if (current != null && (computed === undefined ? current : current > computed)) {
        computed = current;
        result = value;
      }
    }
    return result;
  };
  
  // ==================== 应用程序对象 ====================
  // 使用 useMemo 缓存应用程序对象，避免重复创建
  const App: any = useMemo(() => [], []);
  
  // ==================== 初始化应用程序 ====================
  App.setup = function () {

    // ==================== 粒子系统配置 ====================
    this.lifespan = 1000;  // 粒子生命周期（帧数）
    this.popPerBirth = 1;  // 每次出生的粒子数量
    this.maxPop = 300;  // 最大粒子数量
    this.birthFreq = 2;  // 出生频率（每多少帧出生一次）
    this.bgColor = '#141d2b';  // 背景颜色

    // ==================== 创建 Canvas ====================
    var canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;  // 设置 Canvas 宽度为窗口宽度
    canvas.height = window.innerHeight;  // 设置 Canvas 高度为窗口高度
    canvas.style.opacity = '0.5';  // 设置透明度
    makeAbsolute(canvas);  // 设置绝对定位
    this.canvas = canvas;
    
    // ==================== 添加 Canvas 到容器 ====================
    const container = document.getElementById('fancy-background');
    if (container) {
      container.style.color = this.bgColor;
      makeAbsolute(container);
      container.appendChild(canvas);
    }
    
    // ==================== 设置 Canvas 上下文 ====================
    this.ctx = this.canvas.getContext('2d');  // 获取 2D 绘图上下文
    this.width = this.canvas.width;  // 保存 Canvas 宽度
    this.height = this.canvas.height;  // 保存 Canvas 高度
    this.dataToImageRatio = 1;  // 数据到图像的缩放比例
    this.ctx.imageSmoothingEnabled = false;  // 禁用图像平滑
    this.ctx.webkitImageSmoothingEnabled = false;  // 禁用 WebKit 图像平滑
    this.ctx.msImageSmoothingEnabled = false;  // 禁用 MS 图像平滑
    this.xC = this.width / 2;  // 中心 X 坐标
    this.yC = this.height / 2;  // 中心 Y 坐标
  
    this.stepCount = 0;  // 步数计数器
    this.particles = [];  // 粒子数组

    // ==================== 构建网格 ====================
    this.gridSize = 8;  // 网格大小（运动坐标）
    this.gridSteps = Math.floor(1000 / this.gridSize);  // 网格步数
    this.grid = [];  // 网格数组
    var i = 0;  // 网格索引
    
    // 遍历创建网格点
    for (var xx = -500; xx < 500; xx += this.gridSize) {
      for (var yy = -500; yy < 500; yy += this.gridSize) {
        // 径向场，r 的三角函数，在 r0 附近达到最大值
        var r = Math.sqrt(xx * xx + yy * yy),  // 计算到中心的距离
          r0 = 100,  // 参考半径
          field;  // 场值
  
        if (r < r0) field = (255 / r0) * r;  // r < r0 时线性增长
        else if (r > r0) field = 255 - Math.min(255, (r - r0) / 2);  // r > r0 时线性衰减
  
        // 添加网格点
        this.grid.push({
          x: xx,  // X 坐标
          y: yy,  // Y 坐标
          busyAge: 0,  // 忙碌年龄
          spotIndex: i,  // 网格点索引
          isEdge:  // 判断是否为边缘点
            xx === -500
              ? 'left'
              : xx === -500 + this.gridSize * (this.gridSteps - 1)
              ? 'right'
              : yy === -500
              ? 'top'
              : yy === -500 + this.gridSize * (this.gridSteps - 1)
              ? 'bottom'
              : false,
          field: field,  // 场值
        });
        i++;
      }
    }
    this.gridMaxIndex = i;  // 网格最大索引
  
    // ==================== UI 计数器 ====================
    this.drawnInLastFrame = 0;  // 上一帧绘制的粒子数
    this.deathCount = 0;  // 死亡粒子计数
  
    this.initDraw();  // 初始化绘制
  };
  
  // ==================== 演化函数 ====================
  // 每帧调用，更新粒子状态并重绘
  App.evolve = function () {
    var time1 = performance.now();  // 记录开始时间
  
    this.stepCount++;  // 增加步数
  
    // 增加所有网格点的年龄
    this.grid.forEach(function (e: any) {
      if (e.busyAge > 0) e.busyAge++;
    });
  
    // 根据出生频率生成新粒子
    if (
      this.stepCount % this.birthFreq === 0 &&
      this.particles.length + this.popPerBirth < this.maxPop
    ) {
      this.birth();
    }
    
    // 移动和绘制粒子
    App.move();
    App.draw();
  
    var time2 = performance.now();  // 记录结束时间
  
    // ==================== 更新 UI ====================
    // 更新页面上的计数器显示
    const elemDead = document.getElementsByClassName('dead');
    if (elemDead && elemDead.length > 0) elemDead[0].textContent = this.deathCount;

    const elemAlive = document.getElementsByClassName('alive');
    if (elemAlive && elemAlive.length > 0) elemAlive[0].textContent = this.particles.length;
    
    const elemFPS = document.getElementsByClassName('fps');
    if (elemFPS && elemFPS.length > 0) elemFPS[0].textContent = Math.round(1000 / (time2 - time1)).toString();
    
    const elemDrawn = document.getElementsByClassName('drawn');
    if (elemDrawn && elemDrawn.length > 0) elemDrawn[0].textContent = this.drawnInLastFrame;
  };
  
  // ==================== 出生函数 ====================
  // 在随机网格位置生成新粒子
  App.birth = function () {
    var x, y;
    var gridSpotIndex = Math.floor(Math.random() * this.gridMaxIndex);  // 随机选择网格点
    var gridSpot = this.grid[gridSpotIndex];
    x = gridSpot.x;
    y = gridSpot.y;
  
    // 创建粒子对象
    var particle = {
      hue: 200,  // 色相
      sat: 95,  // 饱和度
      lum: 20 + Math.floor(40 * Math.random()),  // 亮度（随机）
      x: x,  // X 坐标
      y: y,  // Y 坐标
      xLast: x,  // 上一次 X 坐标
      yLast: y,  // 上一次 Y 坐标
      xSpeed: 0,  // X 方向速度
      ySpeed: 0,  // Y 方向速度
      age: 0,  // 粒子年龄
      ageSinceStuck: 0,  // 卡住后的年龄
      attractor: {  // 吸引子
        oldIndex: gridSpotIndex,  // 旧网格索引
        gridSpotIndex: gridSpotIndex,  // 当前网格索引
      },
      name: 'seed-' + Math.ceil(10000000 * Math.random()),  // 粒子名称（唯一）
    };
    this.particles.push(particle);  // 添加到粒子数组
  };
  
  // ==================== 杀死粒子函数 ====================
  // 根据粒子名称从数组中移除粒子
  App.kill = function (particleName: any) {
    const newArray = this.particles.filter(
      (seed: any) => seed.name !== particleName
    );
    this.particles = [...newArray];
  };
  
  // ==================== 移动函数 ====================
  // 更新所有粒子的位置和速度
  App.move = function () {
    for (var i = 0; i < this.particles.length; i++) {
      // 获取粒子
      var p = this.particles[i];
  
      // 保存上一次位置
      p.xLast = p.x;
      p.yLast = p.y;
  
      // 获取吸引子和对应的网格点
      var index = p.attractor.gridSpotIndex,
        gridSpot = this.grid[index];
  
      // 可能移动吸引子（有一定概率）
      if (Math.random() < 0.5) {
        // 移动吸引子
        if (!gridSpot.isEdge) {
          // 改变粒子的吸引子网格点和局部移动函数的网格点
          var topIndex = index - 1,
            bottomIndex = index + 1,
            leftIndex = index - this.gridSteps,
            rightIndex = index + this.gridSteps,
            topSpot = this.grid[topIndex],
            bottomSpot = this.grid[bottomIndex],
            leftSpot = this.grid[leftIndex],
            rightSpot = this.grid[rightIndex];
    
          // 找到场值最大的网格点
          var maxFieldSpot = maxBy(
            [topSpot, bottomSpot, leftSpot, rightSpot]
          );
  
          var potentialNewGridSpot = maxFieldSpot;
          
          // 如果新网格点空闲或已空闲一段时间，则移动
          if (
            potentialNewGridSpot.busyAge === 0 ||
            potentialNewGridSpot.busyAge > 15
          ) {
            p.ageSinceStuck = 0;
            p.attractor.oldIndex = index;
            p.attractor.gridSpotIndex = potentialNewGridSpot.spotIndex;
            gridSpot = potentialNewGridSpot;
            gridSpot.busyAge = 1;
          } else p.ageSinceStuck++;
        } else p.ageSinceStuck++;
  
        // 如果卡住太久，杀死粒子
        if (p.ageSinceStuck === 10) this.kill(p.name);
      }
  
      // 弹簧吸引子到中心，带粘度
      const k = 8, visc = 0.4;  // 弹簧常数和粘度
      var dx = p.x - gridSpot.x,
        dy = p.y - gridSpot.y,
        dist = Math.sqrt(dx * dx + dy * dy);  // 距离
  
      // 弹簧力
      var xAcc = -k * dx,
        yAcc = -k * dy;
  
      // 更新速度
      p.xSpeed += xAcc;
      p.ySpeed += yAcc;
  
      // 应用粘度（减速）
      p.xSpeed *= visc;
      p.ySpeed *= visc;
  
      // 存储数据到粒子
      p.speed = Math.sqrt(p.xSpeed * p.xSpeed + p.ySpeed * p.ySpeed);  // 速度大小
      p.dist = dist;  // 距离
  
      // 更新位置
      p.x += 0.1 * p.xSpeed;
      p.y += 0.1 * p.ySpeed;
  
      // 增加年龄
      p.age++;
  
      // 如果太老，杀死粒子
      if (p.age > this.lifespan) {
        this.kill(p.name);
        this.deathCount++;
      }
    }
  };
  
  // ==================== 初始化绘制函数 ====================
  // 用背景色填充整个 Canvas
  App.initDraw = function () {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this.bgColor;
    this.ctx.fill();
    this.ctx.closePath();
  };
  
  // ==================== 绘制函数 ====================
  // 绘制所有粒子和吸引子
  App.draw = function () {
    this.drawnInLastFrame = 0;
    if (!this.particles.length) return false;
  
    // 清空 Canvas
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this.bgColor;
    this.ctx.fill();
    this.ctx.closePath();
  
    // 绘制每个粒子
    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];
  
      // 转换数据坐标到 Canvas 坐标
      var last = this.dataXYtoCanvasXY(p.xLast, p.yLast),
        now = this.dataXYtoCanvasXY(p.x, p.y);
      var attracSpot = this.grid[p.attractor.gridSpotIndex],
        attracXY = this.dataXYtoCanvasXY(attracSpot.x, attracSpot.y);
      var oldAttracSpot = this.grid[p.attractor.oldIndex],
        oldAttracXY = this.dataXYtoCanvasXY(oldAttracSpot.x, oldAttracSpot.y);
  
      this.ctx.beginPath();
      this.ctx.strokeStyle = '#9fef00';  // 粒子颜色（绿色）
      this.ctx.fillStyle = '#9fef00';
  
      // 绘制粒子轨迹
      this.ctx.moveTo(last.x, last.y);
      this.ctx.lineTo(now.x, now.y);
  
      this.ctx.lineWidth = 1.5 * this.dataToImageRatio;
      this.ctx.stroke();
      this.ctx.closePath();
  
      // 绘制吸引子位置
      this.ctx.beginPath();
      this.ctx.lineWidth = 1.5 * this.dataToImageRatio;
      this.ctx.moveTo(oldAttracXY.x, oldAttracXY.y);
      this.ctx.lineTo(attracXY.x, attracXY.y);
      this.ctx.arc(
        attracXY.x,
        attracXY.y,
        1.5 * this.dataToImageRatio,
        0,
        2 * Math.PI,
        false
      );

      this.ctx.strokeStyle = '#9fef00';
      this.ctx.fillStyle = '#9fef00';

      this.ctx.stroke();
      this.ctx.fill();
  
      this.ctx.closePath();
  
      // UI 计数器
      this.drawnInLastFrame++;
    }
  };
  
  // ==================== 数据坐标到 Canvas 坐标转换 ====================
  // 将数据坐标转换为 Canvas 坐标，应用缩放和居中
  App.dataXYtoCanvasXY = function (x: number, y: number) {
    var zoom = 1.6;  // 缩放因子
    var xx = this.xC + x * zoom * this.dataToImageRatio,
      yy = this.yC + y * zoom * this.dataToImageRatio;
  
    return { x: xx, y: yy };
  };
  
  // ==================== 启动动画 ====================
  // 在组件挂载时初始化并启动动画循环
  useEffect(() => {
    App.setup();  // 初始化应用程序
    App.draw();  // 初始绘制
  
    // 动画帧循环
    var frame = function () {
      App.evolve();  // 演化粒子系统
      requestAnimationFrame(frame);  // 请求下一帧
    };
    frame();
  }, [App]);
  
  // ==================== 渲染容器 ====================
  // 返回包含计数器的容器元素
  return (
  <div id='fancy-background'>
    <p><span className='dead'>0</span></p> 
    <p><span className='alive'>0</span></p> 
    <p><span className='drawn'>0</span></p>  
    <p><span className='fps'>0</span></p> 
  </div>
  );
}

export default FancyBackground;
