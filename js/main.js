import * as THREE from 'three';
import { toDoList } from './data.js';
// La FlakesTexture è una textura che può essere applicata a materiali 3D per simulare la presenza di piccoli frammenti o “fiocchi” sulla superficie. Questi fiocchi possono rappresentare dettagli come graffi, imperfezioni o piccole particelle.
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture.js';
// destrutturazione del metodo createApp, mettendola nella variabile vue
const { createApp } = Vue;


// iniziamo ad usare il metodo appena importato, ritornando la mia applicazione e montandola su #app
createApp({ //option object
    data() {
        return {
            toDoList: toDoList,
            elementText: ''
        }
    },
    methods: { // object methods
        // creiamo il toggle per passare done a true o false
        DoneTrueFalse(id) {
            // ritorniamo l'id in una costante 
            const idTDL = this.toDoList.find((el) => {
                return el.id === id;
            })
            // generiamo il toggle
            if (idTDL) {
                idTDL.done = !idTDL.done;
            }
        },

        // inseriamo un metodo per eliminare l'elemento selezionato dalla lista
        deleteElement(id) {
            // prendiamo l'idice dell'elemento
            const index = this.toDoList.findIndex((el) => el.id === id);
            // rimuoviamo l'elemento
            if (index !== -1) {
                this.toDoList.splice(index, 1);
            }
        },

        // inseriamo un metodo per aggiujere un elemento alla lista
        addElement() {
            const newElem = {
                id: null,
                text: this.elementText,
                done: false
            }
            // generiamo l'id del nuovo elemento
            let newId = 0;
            // per ogni elemento nella lista
            this.toDoList.forEach((el) => {
                if (newId < el.id) {
                    newId = el.id;
                }
            });
            // il nuovo itemento ha come id l'id massimo + 1
            newElem.id = newId + 1;
            //ripuliamo l'input
            this.elementText = '';
            // pushamo il nuovo elemento nella lista
            this.toDoList.push(newElem);
        }
    },
    mounted() {
        console.log(this.toDoList)
    } //lifecycle hook, inseriamo un console.log per controllare se this.toDoList funziona
}).mount('#app')


console.log(THREE)


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x757575);

// creiamo gli oggetti di scena, mesh = geometria e materiale

// const geometry = new THREE.BoxGeometry(1, 1, 1);// larghezza, altezza, profondità
const geometry = new THREE.TorusKnotGeometry(20, 1.5, 300, 20, 1, 3);
// creiamo il materiale, stile con cui il cubo verrà rappresentato in un'ambiente 3D
// creiamo la texture per il materiale
/*
Questa classe THREE.CanvasTextur rappresenta una textura basata su un elemento HTML canvas. In altre parole, puoi disegnare direttamente sulla textura utilizzando il contesto del canvas.

new FlakesTexture(): Questo frammento di codice crea una nuova istanza della classe FlakesTexture che sarà utilizzata per creare una texture a fiocchi*/
let texture = new THREE.CanvasTexture(new FlakesTexture());
// come si comporteranno le nostra texture?
texture.wrapS = THREE.RepeatWrapping; //wrapS si riferisce alla modalità di avvolgimento lungo l’asse S (orizzontale) della texture.
// THREE.RepeatWrapping indica che la texture dovrebbe ripetersi senza soluzione di continuità quando raggiunge il bordo dell’oggetto a cui è applicata, in pratica per tutta la superfice
texture.wrapT = THREE.RepeatWrapping;// wrapT si riferisce alla modalità di avvolgimento lungo l’asse T (verticale) della texture.
// settiamo dumque le ripetizioni 
texture.repeat.x = 10;
texture.repeat.y = 10;

// creiamo dunque l'oggetto contenente il materiale e le sue caratteristiche 
const TorusMaterial = {
    //  Questa proprietà rappresenta lo strato di vernice trasparente sopra il materiale. Un valore di 1.0 indica che il materiale ha uno strato di vernice completo.
    clearcoat: 1.0,
    // Questa proprietà controlla la rugosità dello strato di vernice trasparente. Un valore di 0.1 indica una superficie leggermente ruvida.
    clearcoatRoughness: 0.1,
    // Questa proprietà rappresenta la quantità di metallo nel materiale. Un valore di 0.9 suggerisce che il materiale è principalmente metallico.
    metalIness: 0.9,
    // Questa proprietà definisce la rugosità generale del materiale. Un valore di 0.5 indica una superficie moderatamente ruvida.
    roughness: 0.5,
    // Questa proprietà specifica il colore principale del materiale. Il valore 0x8418ca rappresenta un colore viola.
    color: 0x0D6EFD,
    // Questa proprietà è una mappa normale (normal map) che modifica la normale della superficie del materiale. In questo caso, stai utilizzando la texture texture come mappa normale.
    normalMap: texture,
    // Questa proprietà definisce la scala della mappa normale lungo gli assi X e Y. Un valore di new THREE.Vector2(.15, 0.15) indica una leggera deformazione della normale.
    normalScale: new THREE.Vector2(.15, 0.15)
}

// passiamo il colore con il quale andare a colorare il cubo e il testo
const material = new THREE.MeshPhysicalMaterial(TorusMaterial); //  Questa classe rappresenta un materiale fisico che può essere applicato a oggetti 3D nella tua scena. I materiali fisici sono progettati per simulare le proprietà dei materiali reali, come la riflessione, la trasmissione della luce e la rugosità della superficie.

// creiamo la mesh da aggiungere all'iterno della scena

// const mesh = new THREE.Mesh(geometry, material); // passiamo la geometria e il materiale
const mesh = new THREE.Mesh(geometry, material);

// aggiungiamo la mesh alla scena

scene.add(mesh);


// lascena deve essere ripresa da una cam, punto di osservazione (camera prospettica)


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // fild of view (l'angolo verticale di apertura della nostra inquadratura), aspect ratio(il rapporto tra larghezza e altezza), near plane (da dove la nostra camera inizia a vedere), far plane(da dove la nostra camera finisce di vedere)
// impostiamo la posizione dalla quale la cam riprenderà 

camera.position.z = 20;

//  reinderizza la nostra scena, tenendo in considerazione che deve:
//1° deve supportare la trasparenza {alpha: true}
//2° migliorare la qualità visiva {antialias: true}

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

// prima di reinderizzare dobbiamo andare a dire il campo di visione da reinderizzara

renderer.setSize(window.innerWidth, window.innerHeight);

// inseriamo nel DOM il canvas generato dall'oggetto renderer

document.body.appendChild(renderer.domElement); // il canvas è contenuto nella proprietà domElement di renderer


// non basta, se vogliamo rendere l'oggetto dinamico tramite un' animazione dobbiamo creare un loop che continui a generare nuovi render

function renderRate() {
    // andiamo a inserire il nostro primo render all'interno
    renderer.render(scene, camera);

    // deve chiamare se stessa seguendo il framerate del monitor dell'utente

    requestAnimationFrame(renderRate);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    mesh.rotation.z += 0.01;
    mesh.rotation.order = 'YXZ';

}

// faccimo il loop

requestAnimationFrame(renderRate);

// frame loop, 60 volte al minuto aggiurna il canvas generando un nuovo frame


//posizionamento dell'oggetto

// possiamo spostare il nostro oggetto all'interno della scena
const pos = new THREE.Vector3(-10, -10, 1);// creiamo un istanza con un vettore che possiede con attributi i 3 assi 
//assegnamo la posizione alla mesh
mesh.position.add(pos);

// inserimento luci della scena
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(1, 1, 100); // 
scene.add(dirLight);






