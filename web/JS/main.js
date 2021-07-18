var PlaceHolder, Control, scene, camera, GridHelp, sp_light, drt_light, Spin, Bounce, RandomMove, Jump;

function init() {
    scene = new THREE.Scene();
	var plane = getPlane(1000, 0x444444);
    plane.name = 'plane';
	plane.receiveShadow = true;
	plane.rotation.x = Math.PI / 2;
	plane.visible = true;

	var enableFog = true;

    if (enableFog) {
        scene.fog = new THREE.FogExp2(0x444444, 0.005);
    }

    var Moon1 = new THREE.Mesh(new THREE.SphereGeometry(3,100,100),ChangeMaterial('Texture', 'image/Moon_texture.jpg'));
	var Moon2 = new THREE.Mesh(new THREE.SphereGeometry(3,100,100),ChangeMaterial('Solid'));

    var drt_Light = getDirectionalLight(1);
	drt_Light.name = 'dr_Light';
    drt_Light.position.x = -30;
    drt_Light.position.y = 60;
    drt_Light.position.z = 30;
    drt_Light.intensity = 2;
    drt_Light.add(Moon1);

    const gui = new dat.GUI()
    drt_light = gui.addFolder('direct light');
    drt_light.add(drt_Light, 'intensity', 1, 50);
    drt_light.add(drt_Light.position, 'x', -50, 50);
    drt_light.add(drt_Light.position, 'y', -50, 50);
    drt_light.add(drt_Light.position, 'z', -50, 50);
	var parameters = {color: 0xffffff};
	drt_light.addColor(parameters, 'color').onChange( function () {
		drt_Light.color.set( parameters.color );
	}).name('Color');
	drt_light.open();


	var sp_Light = getSpotLight(1);
	sp_Light.name = 'sp_Light';
    sp_Light.position.x = -30;
    sp_Light.position.y = 60;
    sp_Light.position.z = 30;
    sp_Light.intensity = 2;
    sp_Light.add(Moon2);
	sp_Light.visible = false;

    sp_light = gui.addFolder('spotlight');
    sp_light.add(sp_Light, 'intensity', 1, 50);
    sp_light.add(sp_Light.position, 'x', -50, 50);
    sp_light.add(sp_Light.position, 'y', -50, 50);
    sp_light.add(sp_Light.position, 'z', -50, 50);
	sp_light.addColor(parameters, 'color').onChange( function () {
		sp_Light.color.set( parameters.color );
	}).name('Color');

	if (drt_Light.visible == true){
		sp_light.hide();
	}
	else{
		sp_light.show();
	}
	
	PlaceHolder = ChangeTexture(CreateGeo('Box'), ChangeMaterial('Phong'), 'Phong');
    PlaceHolder.material.transparent = true;
	PlaceHolder.material.opacity = 0;

	var Shape = ChangeTexture(CreateGeo('Box'), ChangeMaterial('Solid'), 'Phong');
	PlaceHolder.position.y += 10;
	Shape.name = "object";
	Shape.castShadow = true;
	PlaceHolder.add(Shape);
	scene.add(PlaceHolder);
    


    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth/window.innerHeight,
        1,
        1000
    );

	var GUI_camera = gui.addFolder('Camera');
	GUI_camera.add(camera, 'fov', 1, 180).name("Field of view");
	GUI_camera.add(camera,'near',0.1,50).name("Near");
	GUI_camera.add(camera,'far',1,1000).name("Far");
	GUI_camera.open();


    camera.position.z = 100;
    camera.position.x = 80;
    camera.position.y = 60;
    camera.lookAt(new THREE.Vector3(0,0,0));


    var renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.setClearColor('rgb(68, 68, 68)');
	document.getElementById('webgl').appendChild(renderer.domElement);
	renderer.render(scene, camera);
	
    var controls = new THREE.OrbitControls(camera,renderer.domElement);

    Control = new THREE.TransformControls(camera,renderer.domElement);
	Control.addEventListener('dragging-changed', function ( event ) 
    {
        controls.enabled = ! event.value;
    });
	

	
	Control.mode = 'translate';
	Control.setMode('translate');
	Control.attach(PlaceHolder);

	
	GridHelp = new THREE.GridHelper(1000, 100, 0x000, 0x000);
	GridHelp.name = 'Grid';
	GridHelp.receiveShadow = true;

	var Spin_Moon = anime.timeline({
		targets: [Moon1.rotation],
		keyframes: [
			{x: 0, duration: 10000},
			{x: 0, duration: 600, direction: 'easeOutElastic'},
			{x: 0, duration: 400, direction: 'easeOutElastic'}
			],
		easing: 'linear',
		loop: true,
		autoplay: false,
		direction: 'normal'
	})

	Spin_Moon.add({
		targets: [Moon1.rotation],
		keyframes: [
			{y: Math.PI*3}
		],
		duration: 8000,
		easing: 'linear'
	}, 0);
	Spin_Moon.play();

	Spin = anime.timeline({
		targets: [PlaceHolder.rotation],
		keyframes: [
			{x: 50, duration: 10000},
			{z: -150, duration: 100000},
			],
		easing: 'linear',
		loop: true,
		autoplay: false,
		direction: 'normal'
	})

	Spin.add({
		targets: [PlaceHolder.rotation],
		keyframes: [
			{y: Math.PI*3}
		],
		duration: 8000,
		easing: 'linear'
	}, 0);

	Bounce = anime.timeline({
		targets: [PlaceHolder.rotation],
		keyframes: [
			{x: 20, duration: 10000, direction: 'easeOutElastic'},
			],
		easing: 'easeInBounce',
		loop: true,
		autoplay: false,
		direction: 'normal'
	})

	Bounce.add({
		targets: [PlaceHolder.rotation],
		keyframes: [
			{y: Math.PI*3}
		],
		duration: 8000,
		easing: 'easeInBounce'
	}, 0);

	Jump = anime.timeline({
		targets: PlaceHolder.position,
		keyframes: [
			{x: 10, y: 10, z: 10, duration: 0},
			{y: 30, duration: 1500}],
		easing: 'easeInBounce',
		loop: true,
		autoplay: false,
		direction: 'alternate'
	});

	Jump.add({
		targets: PlaceHolder.rotation,
		y: Math.PI*2,
		x: Math.PI*3,
		duration: 1500,
		easing: 'linear'
	}, 0);

	RandomMove = anime.timeline({
		targets: PlaceHolder.position,
		keyframes: [
			{y: Math.floor(Math.random() * (50 - 10 + 1)) + 10, duration: 500},
			{x: Math.floor(Math.random() * (30 - 10 + 1)) + 10, duration: 500},
			{z: Math.floor(Math.random() * (50 - 10 + 1)) + 10, duration: 500},
			{x: -Math.floor(Math.random() * (50 - 10 + 1)) + 10, duration: 1500},
			{y: Math.floor(Math.random() * (50 - 10 + 1)) + 10, duration: 1500}],
		easing: 'linear',
		loop: true,
		autoplay: false,
		direction: 'alternate'
	});

	RandomMove.add({
		targets: PlaceHolder.position,
		y: Math.PI*10,
		x: Math.PI*3,
		duration: 4000,
		easing: 'easeOutElastic'
	}, 0);

	scene.add(GridHelp);
	scene.add(plane);
	scene.add(drt_Light);
	scene.add(sp_Light);
	scene.add(camera);
	scene.add(Control);
	
    update(renderer,scene,camera,controls);
}


function update(renderer,scene,camera,controls){
	renderer.render(scene,camera);
	controls.update();

	requestAnimationFrame(function(){
		camera.updateProjectionMatrix();
		update(renderer,scene,camera,controls);
	})
}

function Animate(mode){
	switch(mode){
		case 1:
			Spin.play();
			Bounce.pause();
			Jump.pause();
			RandomMove.pause();
			break;
		case 2:
			Spin.pause();
			Bounce.play();
			Jump.pause();
			RandomMove.pause();
			break;
		case 3:
			Spin.pause();
			Bounce.pause();
			Jump.play();
			RandomMove.pause();
			break;
		case 4:
			Spin.pause();
			Bounce.pause();
			Jump.pause();
			RandomMove.play();
			break;
		case 5:
			Spin.play();
			Bounce.pause();
			Jump.pause();
			RandomMove.play();
			break;
		case 6:
			Spin.pause();
			Bounce.pause();
			Jump.pause();
			RandomMove.pause();
			break;
	}
}

function getDirectionalLight(intensity) {
    var light = new THREE.DirectionalLight(0xffffff, intensity);
    light.castShadow = true;

    light.shadow.camera.left = -40;
    light.shadow.camera.bottom = -40;
    light.shadow.camera.right = 40;
    light.shadow.camera.top = 40;

    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    
    return light;
}

function getSpotLight(intensity, color){
	color = color == undefined ? 'rgb(255, 255, 255)' : color;
	var light = new THREE.SpotLight(color, intensity);
	light.castShadow = true;
	light.penumbra = 0.8;

	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;
	light.shadow.bias = 0.001;

	return light;
}


function setGrid(mode){
	switch(mode)
	{
		case 1:
			return true;
			break;
		case 2:
			return false;
			break;
		default:
			true;
	}
}


function getTube(){
    class CustomSinCurve extends THREE.Curve {
        constructor( scale = 1 ) {
            super();
            this.scale = scale;
        }
        getPoint( t, optionalTarget = new THREE.Vector3() ) {
            const tx = t * 15 - 1.5;
            const ty = Math.sin( 10 * Math.PI * t );
            const tz = 0;
            return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
        }
    }
    const path = new CustomSinCurve( 8 );
    const geometry = new THREE.TubeGeometry( path, 1000, 2, 10, false );
    return geometry;
}


function getPlane(size, _color) {
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshPhongMaterial(
        {
            color: _color,
            side: THREE.DoubleSide
        }
    );
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    return mesh;
}

function SetGrid(mode){
	switch(mode)
	{
		case 'On':
			scene.getObjectByName('Grid').visible = true;
			break;
		case 'Off':
			scene.getObjectByName('Grid').visible = false;
			break;
		default:
			scene.getObjectByName('Grid').visible = true;
	}
}

function SetLight(mode){
	
	switch(mode)
	{
		case 1:
			scene.getObjectByName('dr_Light').visible = false;
			scene.getObjectByName('sp_Light').visible = true;
			drt_light.hide();
			sp_light.show();
			break;
		case 2:
			scene.getObjectByName('dr_Light').visible = true;
			scene.getObjectByName('sp_Light').visible = false;
			drt_light.show();
			sp_light.hide();
			break;
		case 3:
			scene.getObjectByName('dr_Light').visible = false;
			scene.getObjectByName('sp_Light').visible = false;
			drt_light.hide();
			sp_light.hide();
			break;
		default:
			Light = getDirectionalLight(1);
	}
	return Light;
}

function CreateGeo(type)
{
	var Geometry;
	switch(type)
	{
		case 'Box':
			Geometry = new THREE.BoxGeometry(20,20,20);
			break;
		case 'Sphere':
			Geometry = new THREE.SphereGeometry(10,42,42);
			break;
		case 'Cone':
			Geometry = new THREE.ConeGeometry(20,50,30);
			break;
		case 'Cylinder':
			Geometry = new THREE.CylinderGeometry(30,40,20,20);
			break;
		case 'Octahedron':
			Geometry = new THREE.OctahedronGeometry(10,2);
			break;
		case 'Ring':
			Geometry = new THREE.RingGeometry(10,5,100);
			break;
		case 'Torus':
			Geometry = new THREE.TorusGeometry(7,2,10,100);
			break;
		case 'TeaPot':
			Geometry = new THREE.TeapotGeometry(10,10);
			break;
        case 'Tube':
            Geometry = getTube();
			break;
	}
	return Geometry;
}

function ChangeGeo(type){
	var Object = PlaceHolder.getObjectByName('object');
	switch(type)
	{
		case 1:
			Object.geometry = CreateGeo("Box");
			break;
		case 2:
			Object.geometry = CreateGeo("Sphere");
			break;
		case 3:
			Object.geometry = CreateGeo("Cone");
			break;
		case 4:
			Object.geometry = CreateGeo("Cylinder");
			break;
		case 5:
			Object.geometry = CreateGeo("Octahedron");
			break;
		case 6:
			Object.geometry = CreateGeo("Ring");
			break;
		case 7:
			Object.geometry = CreateGeo("Torus");
			break;
		case 8:
			Object.geometry = CreateGeo("TeaPot");
			break;
		case 9:
			Object.geometry = CreateGeo("Tube");
			break;
	};
}

function ChangeMaterial(type, url)
{		
	var textures;
	if(url){
		textures = new THREE.TextureLoader().load(url);
		textures.warpS = THREE.RepeatWrapping;
		textures.warpT = THREE.RepeatWrapping;
	}
	var randomColor = Math.floor(Math.random()*16777215).toString(16);
	randomColor = document.body.style.backgroundColor = "#" + randomColor;
	// color.innerHTML = "#" + randomColor;
	var selectedMaterial;
	switch(type)
	{
		case 'Line':
			selectedMaterial = new THREE.LineBasicMaterial({color: randomColor});
			break;
		case 'Points':
			selectedMaterial = new THREE.PointsMaterial({size: 2, color: randomColor});
			break;
		case 'Solid':
			selectedMaterial = new THREE.MeshBasicMaterial({color: randomColor, side: THREE.DoubleSide});
			break;
		case 'Texture':
			selectedMaterial = new THREE.MeshPhongMaterial({color: 'white', side: THREE.DoubleSide, map: textures});
			break;
		default:
			selectedMaterial = new THREE.MeshPhongMaterial({color: randomColor, side: THREE.DoubleSide});
	}
	return selectedMaterial;
}



function ChangeTexture(geometry, material, type)
{
	var Surface;
	switch(type)
	{
		case 'Line':
			Surface = new THREE.Line(geometry,material);
			break;
		case 'Points':
			Surface = new THREE.Points(geometry,material);
			break;
		case 'Solid':
			Surface = new THREE.Mesh(geometry,material);
			break;
		default:
			Surface = new THREE.Mesh(geometry,material);
	}
	return Surface;
}

function SetTexture(type){
	var prevObject = PlaceHolder.getObjectByName('object');
	var Object;
	switch(type)
	{
		case 1:
			Object = new THREE.Points(prevObject.geometry, ChangeMaterial('Points'));
			UpdateObject(Object, prevObject);
			break;
		case 2:
			Object = new THREE.Line(prevObject.geometry, ChangeMaterial("Line"));
			UpdateObject(Object, prevObject);
			break;
		case 3:
			Object = new THREE.Mesh(prevObject.geometry, ChangeMaterial('Solid'));
			UpdateObject(Object, prevObject);
			break;
		case 4:
			var input = document.getElementById('file-input');
			input.onchange = e => {
				var file = e.target.files[0]; 
				const reader = new FileReader();
				reader.addEventListener("load", function () {
					Object = new THREE.Mesh(prevObject.geometry, ChangeMaterial("Texture", reader.result));
					UpdateObject(Object, prevObject);
				}, false);
			
				if (file) {
					reader.readAsDataURL(file);
				}
			} 
			input.click();
			break;
	}
}

function UpdateObject(Object, prevObject){
	Object.position.copy(prevObject.position);
	Object.rotation.copy(prevObject.rotation);
	Object.scale.copy(prevObject.scale);
	Object.name = prevObject.name;
	Object.castShadow = true;
	PlaceHolder.remove(prevObject);
	prevObject.geometry.dispose();
    prevObject.material.dispose();
	PlaceHolder.add(Object);
}

function ChangeTransform(type){
	switch(type)
	{
		case 1: Control.mode = 'translate';
			break;
		case 2: Control.mode = 'rotate';
			break;
		case 3: Control.mode = 'scale';
			break;	
	}
}

init();