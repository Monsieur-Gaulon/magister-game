//script

var qrScanner;

function openQRScanner() {
	document.getElementById("qr-overlay").style.display = "block";

	qrScanner = new Html5Qrcode("qr-reader");

	Html5Qrcode.getCameras().then(cameras => {
		if (!cameras || cameras.length === 0) {
			alert("Aucune caméra détectée.");
			return;
		}

		// 1️⃣ Chercher une caméra arrière
		let backCamera = cameras.find(cam =>
		cam.label.toLowerCase().includes("back") ||
		cam.label.toLowerCase().includes("rear") ||
		cam.label.toLowerCase().includes("environment")
		);

		// 2️⃣ Si non trouvée, prendre la dernière caméra (souvent la meilleure)
		const cameraId = backCamera ? backCamera.id : cameras[cameras.length - 1].id;

		qrScanner.start(
		{ deviceId: { exact: cameraId } },
		{ fps: 10, qrbox: 250 },
		decodedText => {
			console.log(decodedText);
			searchQuestion(decodedText);
			qrScanner.stop();
			closeQRScanner();
			
		},
		errorMessage => {
			// erreurs normales de scan, on ignore
		}
		).catch(err => {
			console.error("Erreur démarrage caméra :", err);
			alert("Impossible d'accéder à la caméra.");
		});
	}).catch(err => {
		console.error("Erreur récupération caméras :", err);
		alert("Accès caméra refusé.");
	});
	
}

function closeQRScanner() {
	if (qrScanner) {
		qrScanner.stop().catch(() => {});
	}
	document.getElementById("qr-overlay").style.display = "none";
}
function searchQuestion(d) {
	console.log("code " , d);
	var input = document.getElementById('codeInput').value.toUpperCase();
	if (d!=""){
		input = d;
	}
	console.log("input ", input);
	const category = input.slice(0, 2);
	const box = document.getElementById('question-box');
	const questionText = document.getElementById('question-text');
	const answerText = document.getElementById('answer-text');

	if (data[input]) {
		const questions = data[input];
		const random = questions[Math.floor(Math.random() * questions.length)];

		box.className = `category-${category}`;
		box.style.display = 'block';
		questionText.innerText = random.q;
		answerText.innerText = random.a;
		answerText.style.display = 'none';
	} else {
		alert("Code inconnu. Veuillez entrer un code valide (ex: CA1, GA1...) ");
		box.style.display = 'none';
	}
}

function revealAnswer() {
	document.getElementById('answer-text').style.display = 'block';
}

function resetPage() {
	document.getElementById('codeInput').value = '';
	document.getElementById('question-box').style.display = 'none';
}
/*
document.getElementById('codeInput').addEventListener('keydown', function(event) {
	if (event.key === 'Enter') {
		event.preventDefault(); // empêche tout comportement par défaut éventuel
		searchQuestion();
	}
	
});
*/

//##################
//# Base questions #
//##################
const data = {
	CA1: [
	{ q: "Conjugue 'manger' à la 1re personne du singulier.", a: "Je mange." },
	{ q: "Conjugue 'finir' à la 3e personne du pluriel.", a: "Ils finissent." },
	{ q: "Conjugue 'prendre' à la 2e personne du singulier.", a: "Tu prends." }
	],
	CA2: [
	{ q: "Conjugue 'boire' à la 2e personne du pluriel.", a: "Vous buvez." },
	{ q: "Conjugue 'lire' à la 3e personne du singulier.", a: "Il lit." },
	{ q: "Conjugue 'écrire' à la 1re personne du pluriel.", a: "Nous écrivons." }
	]
}
