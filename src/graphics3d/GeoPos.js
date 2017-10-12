import { Euler, Mesh, MeshPhongMaterial, SphereGeometry, Vector3 } from 'three';
import { CIRCLE, DEG_TO_RAD } from '../constants';
import { getJ2000SecondsFromJD } from '../utils/JD';
import Gui from '../gui/Gui';

const debugPos = true;

export default function GeoPos(body3d, target) {

	//home sweet home
	const lat = 46.8139;
	const lng = -71.2080;
	let lastLat;
	let lastLng;
	let lastTime;

	const { universe } = body3d.celestial.universe;

	let sphere;
	if (debugPos) {
		const mat = new MeshPhongMaterial({ color: 0xffffff, emissive: 0xff9911 });
		const radius = body3d.getPlanetSize() * 0.008;
		const segments = 50;
		const rings = 50;
		sphere = new Mesh(
			new SphereGeometry(radius, segments, rings),
			mat
		);
		body3d.root.add(sphere);
	}

	this.update = () => {
		const time = getJ2000SecondsFromJD(body3d.celestial.currentJD);
		if (lng === lastLng && lat === lastLat && time === lastTime) return;
		// console.log(lng, lat);
		lastLat = lat;
		lastLng = lng;
		lastTime = time;
		const parsedLat = Number(lat) * DEG_TO_RAD;
		const parsedLng = (((Number(lng) - 180) * DEG_TO_RAD + body3d.celestial.getCurrentRotation()) % CIRCLE);
		// console.log(parsedLng);
		const a = new Euler(
			parsedLat,
			0,
			parsedLng,
			'ZYX'
		);
		const pos = new Vector3(
			0,
			body3d.getPlanetSize(),
			0
		);
		pos.applyEuler(a);
		pos.applyEuler(body3d.celestial.getTilt());
		if (sphere) sphere.position.copy(pos.clone().multiplyScalar(1.01));
		target.position.copy(pos);
		universe.requestDraw();
	};

	this.activate = () => {
		Gui.addGeoloc({ lat, lng }, val => {
			this.lat = val.lat;
			this.lng = val.lng;
			this.update();
		});
		this.update();
	};

	this.deactivate = () => {
		Gui.removeGeoloc();
	};

}
