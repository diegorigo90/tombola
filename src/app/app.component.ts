import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  info = {
    numeriTabellone: [] as any[],
    numeriDaEstrarre: Array.from({ length: 90 }, (_, i) => i + 1),
    numeroEstratto: null as any,
    numeriPrecedenti: [] as any[],
    storico: [] as any[],
  };

  display = false;
  mostraStorico = false;

  constructor(private confirmationService: ConfirmationService) {
    this.getDatiFromStorage();
    if (this.info.numeriPrecedenti.length == 0) {
      this.inizializzaTabellone();
    }
  }

  inizializzaTabellone() {
    this.info.numeriTabellone = [];
    for (let i = 1; i < 91; i++) {
      this.info.numeriTabellone.push({
        valore: i,
        estratto: false,
      });
    }
  }

  nuovaPartita() {
    this.confirmationService.confirm({
      message: 'Vuoi davvero iniziare una nuova partita?',
      accept: () => {
        for (let item of this.info.numeriTabellone) {
          item.estratto = false;
        }

        this.info.numeriDaEstrarre = Array.from(
          { length: 90 },
          (_, i) => i + 1
        );
        this.info.numeroEstratto = null;
        this.info.numeriPrecedenti = [];
        this.mostraStorico = false;
        this.info.storico = [];

        this.salvaDati();
      },
    });
  }

  estrai() {
    const random = Math.floor(
      Math.random() * this.info.numeriDaEstrarre.length
    ); // Scelgo a random
    let estratto = this.info.numeriDaEstrarre[random];
    this.info.numeroEstratto = estratto; // Estraggo il numero
    this.info.numeriDaEstrarre.splice(
      this.info.numeriDaEstrarre.indexOf(estratto),
      1
    ); // Lo rimuovo dalla lista degli estraibili
    this.info.numeriTabellone[estratto - 1].estratto = true; // Lo segno sul tabellone

    if (this.info.numeriPrecedenti.length > 5) {
      this.info.numeriPrecedenti.shift();
    }

    this.info.numeriPrecedenti.push(estratto);

    this.info.storico.push(estratto);
    this.salvaDati();
    this.ultimo();
  }

  elenco(array: any) {
    let newArray = array.slice(0, array.length - 1);
    return newArray.join(' , ');
  }

  visualizzaStoria() {
    this.mostraStorico = !this.mostraStorico;
  }

  salvaDati() {
    localStorage.setItem('tombola', JSON.stringify(this.info));
  }

  getDatiFromStorage() {
    let tombola = localStorage.getItem('tombola');
    if (tombola) {
      this.info = JSON.parse(tombola);
    }
  }
  closeModal() {
    this.display = false;
  }

  ultimo() {
    this.display = true;
    setTimeout(() => {
      this.display = false;
    }, 3000);
  }
}
