class App {
  constructor() {
    const output = document.querySelector('#messageOutput');
    //const increaseButton = document.querySelector('#btn-increase');
    //const decreaseButton = document.querySelector('#btn-decrease');
    const usernameLabel = document.querySelector('#username');
    const counterLabel = document.querySelector('#counter');
    var counter = 0;

    // When the Devvit app sends a message with `context.ui.webView.postMessage`, this will be triggered
    window.addEventListener('message', (ev) => {
      const { type, data } = ev.data;

      // Reserved type for messages sent via `context.ui.webView.postMessage`
      if (type === 'devvit-message') {
        const { message } = data;

        // Always output full message
        output.replaceChildren(JSON.stringify(message, undefined, 2));

        // Load initial data
        if (message.type === 'initialData') {
          const { username, currentCounter } = message.data;
          usernameLabel.innerText = username;
          counterLabel.innerText = counter = currentCounter;
        }

        // Update counter
        if (message.type === 'updateCounter') {
          const { currentCounter } = message.data;
          counterLabel.innerText = counter = currentCounter;
        }
      }
    });

    // increaseButton.addEventListener('click', () => {
    //   // Sends a message to the Devvit app
    //   window.parent?.postMessage(
    //     { type: 'setCounter', data: { newCounter: Number(counter + 1) } },
    //     '*'
    //   );
    // });

    // decreaseButton.addEventListener('click', () => {
    //   // Sends a message to the Devvit app
    //   window.parent?.postMessage(
    //     { type: 'setCounter', data: { newCounter: Number(counter - 1) } },
    //     '*'
    //   );
    // });

    // Events on buttons
    let btn1 = document.querySelector('#jumpKnight');
    btn1.addEventListener('click', () => {
      JumpReset('cav');
    });
    let btn2 = document.querySelector('#jump100');
    btn2.addEventListener('click', () => {
      JumpReset('100');
    });

    // Apply events to game cells
    for (let i = 0; i < 49; i++) {
      let cellButton = document.querySelector('#c' + i);
      cellButton.addEventListener('click', () => {
        gioco(i);
      });
    }


  }
}

new App();


// Reset the game and restart
var Met = 'cav';
function JumpReset(method) {
  Met = method;
  for (let i = 0; i < 49; i++) {
    $("#c" + i).html('  ').removeClass('available').css("background-color", "Black");
  }
  Ult = -1;
}


var Ult = -1;
function gioco(p) {
  off = '  ';
  err = ' ';
  dim = 7;  // Square dimension (from 5 to 10)
  max = 49;  // Max value for the square schema 
  //Met = 'cav';  // Method 100 or 'cav'
  // Mosse 100
  cenR = new Array(0, 2, 3, 2, 0, -2, -3, -2);
  cenC = new Array(3, 2, 0, -2, -3, -2, 0, 2);
  // Mosse Cavallo
  cavR = new Array(1, 2, 2, 1, -1, -2, -2, -1);
  cavC = new Array(2, 1, -1, -2, -2, -1, 1, 2);
  /*Riga e colonna attuale*/
  rig = Math.floor(p / dim) + 1;
  col = p - (rig - 1) * dim + 1;
  /*Controlla se mossa valida*/
  //ult = document.form1.ult.value;
  if (Ult >= 0) {
    valido = false;
    ultRig = Math.floor(Ult / dim) + 1;
    ultCol = Ult - (ultRig - 1) * dim + 1;
    if (Met == 100) {
      for (n = 0; n < 8; n++) {
        if (rig == ultRig + cenR[n] && col == ultCol + cenC[n]) { valido = true }
      }
    }
    if (Met == "cav") {
      for (n = 0; n < 8; n++) {
        if (rig == ultRig + cavR[n] && col == ultCol + cavC[n]) { valido = true }
      }
    }
  } else {
    valido = true;
  }
  /*Assegna il numero alla cella contando le celle riempite*/
  if (valido) {
    if ($("#c" + p).html() == off) {
      /*Conta quante celle sono state riempite*/
      var cont = 0;
      for (var n = 0; n < max; n++) {
        /*Cancella suggerimenti della mossa precedente*/
        if ($("#c" + n).html() == off) {
          $("#c" + n).removeClass('available').html(err);
        }
        nVicini = 0;
        if ($("#c" + n).html() != off && $("#c" + n).html() != err) {
          cont++;
        } else {
          /* Colora eventuali celle a rischio */
          for (i = 0; i < 8; i++) {
            rig0 = Math.floor(n / dim) + 1; col0 = n - (rig0 - 1) * dim + 1;
            if (Met == "100") { proxRig = rig0 + cenR[i]; proxCol = col0 + cenC[i]; }
            if (Met == "cav") { proxRig = rig0 + cavR[i]; proxCol = col0 + cavC[i]; }
            if (proxRig >= 1 && proxRig <= dim && proxCol >= 1 && proxCol <= dim) {
              nProx = ((proxRig - 1) * dim) + proxCol - 1;
              if ($("#c" + nProx).html() == err || $("#c" + nProx).html() == off) {
                nVicini++;
              }
            }
            if (nVicini > 2) i = 8;
          }
        }
        if (nVicini == 2 && n != p)
          $("#c" + n).css("background-color", "Orange");
        else if (nVicini == 1 && n != p)
          $("#c" + n).css("background-color", "Red");
        else if (nVicini == 0 && $("#c" + n).html() == 0 && n != p)
          $("#c" + n).css("background-color", "Blue");
        else
          $("#c" + n).css("background-color", "Black");
      }
      /*Assegna il numero alla Cella*/
      cont++;
      $("#c" + p).html(cont);
      Ult = p;
      $('#cellCount').html(cont);
      //document.form1.info.value = 'Celle ' + cont;
    } else {
      //$('#popupMossaNonValida').popup("open");
      valido = false;
    }
  } else {
    //$('#popupMossaNonValida').popup("open");
    //alert('Mossa non valida!');
  }

  /*Verifica se il gioco e' finito e mostra le mosse valide*/
  if (valido) {
    fine = true;
    for (n = 0; n < 8; n++) {
      if (Met == "100") {
        proxRig = rig + cenR[n];
        proxCol = col + cenC[n];
      }
      if (Met == "cav") {
        proxRig = rig + cavR[n];
        proxCol = col + cavC[n];
      }
      if (proxRig >= 1 && proxRig <= dim && proxCol >= 1 && proxCol <= dim) {
        prox = ((proxRig - 1) * dim) + proxCol - 1;
        if ($("#c" + prox).html() == err) {
          fine = false;
          $("#c" + prox).addClass('available').html(off);
        }
      }
    }
    if (fine) {
      if (Ult > 0) {
        Ult = 0;

        //nome=prompt('Fine partita! Hai coperto '+cont+' caselle. Inserisci il tuo nome da mettere nei Record:','');
        //if (nome!=null) {
        soluz = '';
        for (var n = 0; n < max; n++) {
          num = $("#c" + n).html();
          if (num == 0) { num = '__' }
          if (num.length == 1) { num = '0' + num }
          if (num.length == 3) { num = '00' }
          soluz = soluz + num;
        }
        //	window.open("http://giro.altervista.org/game/record.php?game="+met+"&dim="+dim+"&nome="+nome+"&punti="+cont+"&soluz="+soluz,"displayWindow","toolbar=no,scrollbars=yes,width=400");
        //}

        //$('#aSaveScore').attr('href', 'saveScore.php?game=' + met + '&dim=' + dim + '&punti=' + cont + '&soluz=' + soluz);
        //$('#aSaveScore').click();


      }
    }
  }

}

