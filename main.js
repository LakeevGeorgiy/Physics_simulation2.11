let lens_curvature_radius_text = document.getElementById("lens_curvature_radius_id");
let refractive_index_lens_text = document.getElementById("refractive_index_lens_id");
let refractive_index_plate_text = document.getElementById("refractive_index_plate_id");
let refractive_index_env_text = document.getElementById("refractive_index_env_id");
let wave_length_text = document.getElementById("wave_length_id");
let intensity_text = document.getElementById("intensity_id");
let canvas = document.getElementById("canvas_id");
let button = document.getElementById("button_id");

let lens_curvature_radius = lens_curvature_radius_text.value;
let refractive_index_lens = refractive_index_lens_text.value;
let refractive_index_plate = refractive_index_plate_text.value;
let refractive_index_env = refractive_index_env_text.value;
let wave_length = wave_length_text.value;
let intensity = intensity_text.value;
let ctx = canvas.getContext('2d');

function calculateIntensity(x){

    const fresnel_coeff_r = ((refractive_index_plate - refractive_index_env) / (refractive_index_plate + refractive_index_env)) ** 2;
    const fresnel_coeff_t = 4 * refractive_index_env * refractive_index_plate / ((refractive_index_env + refractive_index_plate) ** 2);
    const optical_difference = x ** 2 / lens_curvature_radius * refractive_index_env + wave_length / 2;
    
    const first = intensity * fresnel_coeff_t ** 2 * fresnel_coeff_r;
    const second = intensity * fresnel_coeff_r;
    const third = 2 * intensity * fresnel_coeff_r * fresnel_coeff_t * Math.cos(2 * Math.PI / wave_length * optical_difference);

    return first + second + third;

}

function plot() {

    let x_coordinates = [];
    let intensity_coordinates = [];
    let shapes = [];

    let t = 0;
    for (let i = 0; i < 0.001; i += 0.000001) {
        x_coordinates[t] = i;
        intensity_coordinates[t] = calculateIntensity(i);
        ++t;
    }

    let intensity_trace = {
        x: x_coordinates,
        y: intensity_coordinates,
        mode: 'line'
    };

    for (let i = 0; i < intensity_coordinates.length; i++){

        let currentIntensity = intensity_coordinates[i];
        let currentColor = 255 * currentIntensity / intensity;
        let color=`rgba(${currentColor},${currentColor},${currentColor}, 1)`;
        // Домножение на константу иначе не видно кольца
        let radius = Math.sqrt((i - 0.5) * wave_length * lens_curvature_radius / refractive_index_env) * 7500;
        
    
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    let layout2 = {
        title: 'График интенсивности',
		autosize: true,
		xaxis: {
			title: 'x, м',
		},
		yaxis: {
			title: 'I, Bт/м^2',
		},
	};

	Plotly.react('tester2', [intensity_trace], layout2);
}

button.addEventListener("click", function(e){

    lens_curvature_radius = parseFloat(lens_curvature_radius_text.value);
    if (lens_curvature_radius < 0){
        alert("Радиус кривизны линзы должен быть больше 0!");
        return;
    }

    refractive_index_lens = parseFloat(refractive_index_lens_text.value);
	if (refractive_index_lens <= 0) {
		alert("Показатель преломления линзы должен быть больше 0!");
		return;
	}
    
    refractive_index_plate = parseFloat(refractive_index_plate_text.value);
	if (refractive_index_plate <= 0) {
		alert("Показатель преломления пластины должен быть больше 0!");
		return;
	}
    
    refractive_index_env = parseFloat(refractive_index_env_text.value);
	if (refractive_index_env <= 0) {
		alert("Показатель преломления среды должен быть больше 0!");
		return;
	}
    

	wave_length = parseFloat(wave_length_text.value);
    wave_length /= (10 ** 9);
	if (wave_length <= 0) {
		alert("Длина волны должна быть больше 0!");
		return;
	}

    intensity = parseFloat(intensity_text.value);
    if (intensity <= 0){
        alert("Интенсивность должа быть больше 0!");
        return;
    }

    plot();

});