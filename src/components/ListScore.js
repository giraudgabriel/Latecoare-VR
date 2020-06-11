import React from "react";
import ItemScore from "./ItemScore";
import scoreService from "../services/ScoreService";

const ListScore = () => {
  const [scores, setScores] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await scoreService.getAll();
        setScores(data);
      } catch (error) {
        fetch("../db.json").then(response => {
          response.json().then(data => {
            const { score } = data;
            setScores(score);
          });
        });
      }
    }
    fetchData();
  }, []);

  function renderScores() {
    if (scores.length > 0) {
      return scores.map(score => <ItemScore key={score.id} score={score} />);
    } else {
      return (
        <tr className="alert alert-warning">
          <td colSpan="6" className="text-center">
            Nenhuma tentativa encontrada
          </td>
        </tr>
      );
    }
  }

  return (
    <div className="m-3">
      <h3 className="text-center">Ranking de Tentativas</h3>
      <table className="table table-bordered">
        <thead>
          <tr className="text-center">
            <th>Data</th>
            <th>Ordem</th>
            <th>Tentativas</th>
            <th>Acertos</th>
            <th>Erros</th>
            <th>Aproveitamento</th>
          </tr>
        </thead>
        <tbody>{renderScores()}</tbody>
      </table>
    </div>
  );
};

export default ListScore;
