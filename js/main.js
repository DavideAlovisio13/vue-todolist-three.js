import * as THREE from 'three';
//GSAP (GreenSock Animation Platform) è una libreria JavaScript ampiamente utilizzata per creare animazioni fluide e interattive all’interno di pagine web
import gsap from 'gsap';
// importiamo i dati per la nostra applicazione 
import { toDoList } from './data.js';
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
        setTimeout(this.toDoList, 3000)
    } //lifecycle hook, inseriamo un console.log per controllare se this.toDoList funziona
}).mount('#app')


console.log(THREE)


const scene = new THREE.Scene();
scene.background = new THREE.Color(0xC89353);

// creiamo gli oggetti di scena, mesh = geometria e materiale

const geometry = new THREE.TorusKnotGeometry(20, 1.5, 300, 20, 1, 3);
// creiamo il materiale, stile con cui il cubo verrà rappresentato in un'ambiente 3D

// creiamo l'oggetto contenente il materiale e le sue caratteristiche 
const TorusMaterial = {
    //  Questa proprietà rappresenta lo strato di vernice trasparente sopra il materiale. Un valore di 1.0 indica che il materiale ha uno strato di vernice completo.
    clearcoat: 1,
    // Questa proprietà controlla la rugosità dello strato di vernice trasparente. Un valore di 0.1 indica una superficie leggermente ruvida.
    clearcoatRoughness: 0.1,
    // Questa proprietà rappresenta la quantità di metallo nel materiale. Un valore di 0.9 suggerisce che il materiale è principalmente metallico.
    metalIness: 0.9,
    // Questa proprietà definisce la rugosità generale del materiale. Un valore di 0.5 indica una superficie moderatamente ruvida.
    roughness: 0,
    // Questa proprietà specifica il colore principale del materiale. Il valore 0x8418ca rappresenta un colore viola.
    color: 0x3FC3BA,
    // Questa proprietà definisce la scala della mappa normale lungo gli assi X e Y. Un valore di new THREE.Vector2(.15, 0.15) indica una leggera deformazione della normale.
    normalScale: new THREE.Vector2(.15, 0.15)
}

// passiamo l'oggetto contente il materiale e le sue caratteristiche all'istanza del materiale
const material = new THREE.MeshPhysicalMaterial(TorusMaterial); //  Questa classe rappresenta un materiale fisico che può essere applicato a oggetti 3D nella tua scena. I materiali fisici sono progettati per simulare le proprietà dei materiali reali, come la riflessione, la trasmissione della luce e la rugosità della superficie.

// creiamo la mesh da aggiungere all'iterno della scena

// const mesh = new THREE.Mesh(geometry, material); // passiamo la geometria e il materiale
const mesh = new THREE.Mesh(geometry, material);

//posizionamento dell'oggetto

// possiamo spostare il nostro oggetto all'interno della scena
const pos = new THREE.Vector3(-10, -10, 1);// creiamo un istanza con un vettore che possiede con attributi i 3 assi 
//assegnamo la posizione alla mesh
mesh.position.add(pos);

// inserimento luci della scena
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(1, 1, 100); // 

// aggiungiamo la mesh alla scena

scene.add(mesh, dirLight);


// lascena deve essere ripresa da una cam, punto di osservazione (camera prospettica)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // fild of view (l'angolo verticale di apertura della nostra inquadratura), aspect ratio(il rapporto tra larghezza e altezza), near plane (da dove la nostra camera inizia a vedere), far plane(da dove la nostra camera finisce di vedere)

// impostiamo la posizione dalla quale la cam riprenderà 

camera.position.z = 30;

//  reinderizza la nostra scena, tenendo in considerazione che deve:
//1° deve supportare la trasparenza {alpha: true}
//2° migliorare la qualità visiva {antialias: true}

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

// prima di reinderizzare dobbiamo andare a dire al nostro renderer il campo di visione da reinderizzara

renderer.setSize(window.innerWidth, window.innerHeight);

// inseriamo nel DOM il canvas generato dall'oggetto renderer

document.body.appendChild(renderer.domElement); // il canvas è contenuto nella proprietà domElement di renderer


// non basta, se vogliamo rendere l'oggetto dinamico tramite un' animazione dobbiamo creare un loop che continui a generare nuovi render

function renderRate() {
    // andiamo a inserire il nostro primo render all'interno
    renderer.render(scene, camera);

    // deve chiamare se stessa seguendo il framerate del monitor dell'utente

    requestAnimationFrame(renderRate); // è un metodo utilizzato in JavaScript per gestire le animazioni e migliorare le prestazioni delle animazioni all’interno del browser.  Viene chiamata con un parametro callback, che è la funzione che desideri eseguire per aggiornare un’animazione prima del prossimo ridisegno della pagina123.


    mesh.rotation.x += 0.001;
    mesh.rotation.y += 0.001;
    mesh.rotation.z += 0.001;
    mesh.rotation.order = 'YXZ';

}

// faccimo il loop

requestAnimationFrame(renderRate);

// frame loop, 60 volte al minuto aggiurna il canvas generando un nuovo frame


// animazioni elementi su eventi
function animation() {
    gsap.to(mesh.scale, { duration: 2, x: 2, y: 2, z: 2 })// primo par target, secondo durata e gli dobbiamo dire qual'è lo stadio finale della animazione, i valori che dopo un secondo deviono essere modificati e in che modo
    gsap.to(mesh.rotation, { duration: 2, x: 1, y: 1, z: 1 })// rotazione
    gsap.fromTo('#app', { opacity: 0 }, { opacity: 1, duration: 5 }) // da una condizione ad un'altra nell'arco di un tempo indicato 
}

//settiamo quando avverrà 
window.addEventListener('load', animation);





