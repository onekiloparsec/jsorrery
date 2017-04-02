import { Vector3, Euler, Quaternion, Mesh, SphereGeometry, MeshPhongMaterial } from 'three';
import Dimensions from 'graphics3d/Dimensions';
import { KM, DEG_TO_RAD, RAD_TO_DEG, CIRCLE } from 'constants';
import { getUniverse } from 'JSOrrery';
import Gui from 'gui/Gui';

export default function(body3d) {
	// console.log(name);
	// console.log(body3d.getPlanetSize());
	// console.log(body3d.celestial.radius * KM);
	let lat = 45;
	let lng = -73;

	const mat = new MeshPhongMaterial({ color: 0xffffff });
	const radius = body3d.getPlanetSize() * 0.01;
	const segments = 50;
	const rings = 50;
	const sphere = new Mesh(
		new SphereGeometry(radius, segments, rings),
		mat
	);
	//console.log(this.celestial.name+' size ',radius, ' m');
	body3d.planet.add(sphere);

	function posCam() {
		//this.celestial.radius * KM
		// body3d.cameras[name].position.z = Dimensions.getScaled(2698453);
		// body3d.cameras[name].position.x = Dimensions.getScaled(lat);
		// const angle = Math.asin(lat / (body3d.celestial.radius * KM)) * RAD_TO_DEG;
		console.log(lng, lat);
		const a = new Euler(-lat * DEG_TO_RAD, (Number(lng) + 90) * DEG_TO_RAD, 0, 'YXZ');
		const pos = new Vector3(0, 0, body3d.getPlanetSize());	
		pos.applyEuler(a);
		sphere.position.copy(pos);
		getUniverse().getScene().draw();
	}

	Gui.addSlider('lat', { min: -90, max: 90, initial: lat }, val => {
		lat = val;
		posCam();
	});
	Gui.addSlider('lng', { min: -180, max: 180, initial: lng }, val => {
		lng = val;
		posCam();
	});
	posCam();
}