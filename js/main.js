if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;

var camera, scene, renderer, objects;
var keyLight, fillLight, backLight;
var dae;

var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load( 'models/greenhouse.dae', function ( collada ) {

	dae = collada.scene;
	skin = collada.skins[ 0 ];

	dae.scale.x = dae.scale.y = dae.scale.z = 0.002;
	dae.updateMatrix();

	init();
	animate();

} );

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.set( 3, 3, 6 );

	scene = new THREE.Scene();

	// Grid

	var size = 14, step = 1;

	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial( { color: 0x303030 } );

	for ( var i = - size; i <= size; i += step ) {

		geometry.vertices.push( new THREE.Vector3( - size, - 0.04, i ) );
		geometry.vertices.push( new THREE.Vector3(   size, - 0.04, i ) );

		geometry.vertices.push( new THREE.Vector3( i, - 0.04, - size ) );
		geometry.vertices.push( new THREE.Vector3( i, - 0.04,   size ) );

	}

	var grid = new THREE.Line( geometry, material, THREE.LinePieces );
	scene.add( grid );


	// Add the COLLADA

	scene.add( dae );

	// Lights

	// scene.add( new THREE.AmbientLight( 0x808080 ) );

	keyLight = new THREE.PointLight( 0xffffff, 1 );
	keyLight.position.x = 4;
	keyLight.position.y = 4;
	keyLight.position.z = 4;
	scene.add( keyLight );

	fillLight = new THREE.PointLight( 0xffffff, .5 );
	fillLight.position.x = -5;
	fillLight.position.y = 5;
	fillLight.position.z = 7;
	scene.add( fillLight );

	fillLight = new THREE.PointLight( 0xffffff, .35 );
	fillLight.position.x = 0;
	fillLight.position.y = 5;
	fillLight.position.z = -10;
	scene.add( fillLight );

	// Camera Controls

	controls = new THREE.OrbitControls( camera, container );
	controls.addEventListener( 'change', render );
	controls.minDistance = 0;
	controls.maxDistance = 50;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	// GUI
	var gui = new dat.GUI();

	var colladaFolder = gui.addFolder ('Collada Scale')
	colladaFolder.open();

	gui.add(dae.scale, 'x', .002, .01)
		.name('Scale X');
	gui.add(dae.scale, 'y', .002, .01)
		.name('Scale Y');
	gui.add(dae.scale, 'z', .002, .01)
		.name('Scale Z');


	// Events

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();
	controls.update();

}

function render() {

	camera.lookAt( scene.position );
	renderer.render( scene, camera );

}
