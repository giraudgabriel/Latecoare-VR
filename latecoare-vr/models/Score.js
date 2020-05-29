const scoreController = new ScoreController();

class Score {
    constructor(erros, acertos, ordem){
        this.tentativas = acertos + erros;
        this.aproveitamento = (acertos / this.tentativas * 100.0);
        this.erros = erros;
        this.ordem = ordem;
        this.acertos = acertos;
        this.date = new Date();
        scoreController.add(this)
    }
}