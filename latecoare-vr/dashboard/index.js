
const api = axios.create({baseURL: 'http://localhost:3001'})
const pieceController = new PieceController();
const scoreController = new ScoreController();

const App = () => {
    const [selectedPiece,
        setSelectedPiece] = React.useState();
    return (
        <div>
            <Menu/>
            <div className="row m-3">
                <div className="col card">
                    <h3 className="text-center">Cadastro de Peças</h3>
                    <FormPiece piece={selectedPiece}/>
                </div>
                <div className="col">
                    <iframe src="../index.html" width="480px" height="330px" frameBorder="0"></iframe>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <ListPiece setSelectedPiece={setSelectedPiece}/>
                </div>
                <div className="col">
                    <ListScore/>
                </div>
            </div>
        </div>
    )
}

const Input = (props) => {
    return <div className="input-group mb-3">
        <div className="input-group-prepend">
            <span className="input-group-text">
                {props.label}
            </span>
        </div>
        <input
            className="form-control"
            placeholder={props.placeholder}
            value={props.value}
            disabled={props.disabled}
            onChange={(e) => props.handleInput(e.target.value)}/>
    </div>
}

const Menu = () => {
    return <ul className="nav mb-3">
        <li className="nav-item">
            <h3 className="nav-link active" href="#">Latecoere VR</h3>
        </li>
    </ul>
}

const FormPiece = (props) => {
    const [id,
        setId] = React.useState('');
    const [src,
        setSrc] = React.useState('');
    const [src_img,
        setSrcImg] = React.useState('');
    const [piece,
        setPiece] = React.useState();

    React.useEffect(() => {
        if (props.piece) {
            const {id, src, src_img} = props.piece;
            setId(id)
            setSrc(src)
            setSrcImg(src_img)
            setPiece(props.piece)
        }
    }, [props.piece])

    function limparForm(e) {
        e.preventDefault();
        setId('')
        setPiece('')
        setSrc('')
        setSrcImg('')
    }
    async function handleSubmit(e) {
        e.preventDefault();
        if (id !== '' && src !== '' && src_img !== '') {
            const response = piece
                ? await pieceController.patch(new Piece(id, src, src_img))
                : await pieceController.add(new Piece(id, src, src_img));
            if (response.status === 201 || response.status === 200) {
                alert('Peça salva com sucesso!')
            } else {
                alert('Algum erro ocorreu!')
            }
        } else {
            alert('Preencha os campos vazios!')
        }

    }

    async function handleDelete(e) {
        e.preventDefault();
        if (piece && confirm('Deseja realmente excluir?')) {
            const response = await pieceController.delete(piece.id);
            if (response.status === 200) {
                alert('Peça excluída com sucesso!')
            } else {
                alert('Algum erro ocorreu!')
            }
        }
    }

    return <form>
        <button onClick={limparForm} className="btn btn-light">Nova peça</button>
        <div className="form-group m-3">
            <Input
                label="ID"
                placeholder="Identificador da peça"
                disabled={piece}
                value={id}
                handleInput={setId}/>
            <Input
                label="GLTF URL"
                placeholder="gltf.com/gltf.gltf"
                value={src}
                handleInput={setSrc}/>
            <Input
                label="IMAGEM URL"
                placeholder="image.com/img.png"
                value={src_img}
                handleInput={setSrcImg}/>

            <button onClick={handleSubmit} className="btn btn-success btn-block">
                Salvar</button>
            <button
                onClick={handleDelete}
                hidden={!piece}
                className="btn btn-danger btn-block">
                Excluir</button>
        </div>
    </form>

}

const ListScore = () => {
    const [scores,
        setScores] = React.useState([]);

    React.useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await scoreController.getAll();
                setScores(data);
            } catch (error) {
                fetch('../db/db.json').then(response => {
                    response
                        .json()
                        .then(data => {
                            const {score} = data;
                            setScores(score);
                        });
                })
            }
        }
        fetchData();
    }, []);

    return <div className="m-3">
        <h3 className="text-center">
            Ranking de Tentativas</h3>
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
            <tbody>
                {scores.map(score => (<ItemScore key={score.id} score={score}/>))}
            </tbody>
        </table>
    </div>
}

const ItemScore = ({score}) => {

    function renderItem() {
        return <tr>
            <td>{new Date(score.date).toLocaleString()}</td>
            <td>{JSON.stringify(score.ordem)}</td>
            <td>{score.tentativas}</td>
            <td>{score.acertos}</td>
            <td>{score.erros}</td>
            <td>{score
                    .aproveitamento
                    .toFixed(2) + '%'}</td>
        </tr>
    }

    return renderItem()
}

const ItemPiece = ({piece, handleSelected}) => {

    function renderItem() {
        return <tr>
            <td>{piece.id}</td>
            <td>
                <a className="btn btn-dark btn-block" href={piece.src}><i className="fa fa-gear"/>
                    Visualizar GLTF</a>
            </td>
            <td>
                <a className="btn btn-warning btn-block" href={piece.src_img}><i className="fa fa-image"/>
                    Visualizar</a>
            </td>
            <td>
                <button
                    onClick={() => handleSelected(piece)}
                    className="btn btn-primary btn-block"><i className="fa fa-edit"/>Alterar</button>
            </td>
        </tr>
    }

    return renderItem()
}

const ListPiece = ({setSelectedPiece}) => {
    const [pieces,
        setPieces] = React.useState([]);

    React.useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await pieceController.getAll();
                setPieces(data);
            } catch (error) {
                fetch('../db/db.json').then(response => {
                    response
                        .json()
                        .then(data => {
                            const {piece} = data;
                            setPieces(piece);
                        });
                })
            }
        }
        fetchData();
    }, []);

    return <div className="m-3">
        <h3 className="text-center">
            Lista de Peças</h3>
        <table className="table table-bordered">
            <thead>
                <tr className="text-center">
                    <th>ID</th>
                    <th>GLTF</th>
                    <th>IMAGEM</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {pieces.map(piece => (<ItemPiece key={piece.id} piece={piece} handleSelected={setSelectedPiece}/>))}
            </tbody>
        </table>
    </div>
}

window.onload = () => {
    ReactDOM.render(
        <App/>, document.querySelector('#root'));
}
