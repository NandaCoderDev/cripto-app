
import { useState, type FormEvent, useEffect } from "react";
import styles from "./home.module.css";
import { BsSearch } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

export interface CoinProps {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  rank: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  explorer: string;
  formatedPrice?: string; // Propriedade opcional para armazenar o preço formatado
  formatedMarket?: string; // Propriedade opcional para armazenar o valor de mercado formatado
  formatedVolume?: string; // Propriedade opcional para armazenar o volume formatado
}

interface DataProp {
  //Ele é um array de CoinProps
  data: CoinProps[];
}

export function Home() {
  const [input, setInput] = useState("");
  const [coins, setcoins] = useState<CoinProps[]>([]);
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    getData(); //Está função faz a requisição http para a API e atualiza o estado 'coins' com os dados recebidos
  }, [offset]);

  async function getData() {
    fetch(
      `https://rest.coincap.io/v3/assets?limit=10&offset=${offset}&apiKey=a874b561f085ffa525fa6a33e644fa10e2dc113e50a85c5e4147108bb8ba08cb`
    )
      .then((response) => response.json())
      .then((data: DataProp) => {
        const coinsData = data.data;

        const price = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        });

        const priceCompact = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact", // Usado para formatar valores grandes em uma forma mais curta, como 1K para 1.000 ou 1M para 1.000.000
        });

        // Aqui você pode formatar os dados conforme necessário , esta tudo dentro do Map
        const formatedResult = coinsData.map((item) => {
          // Criei um objeto e adicionei um item a mais
          const formated = {
            ...item,
            formatedPrice: price.format(Number(item.priceUsd)),
            formatedMarket: priceCompact.format(Number(item.marketCapUsd)), // Adiciona a nova propriedade 'formatedPrice' ao objeto original, para formatar a moeda de string para number
            formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr)),
          };
          return formated;
        });
        // console.log(formatedResult);
        const listCoins = [...coins, ...formatedResult]
        setcoins(listCoins);
      });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (input === "") return;

    navigate(`/detail/${input}`);
  }

  function handleGetMore() {
    if(offset === 0){
        setOffset(10)
        return;
    }

    setOffset(offset + 10);
  }

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite o nome da moeda... Ex bitcoin"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          <BsSearch size={30} color="#FFF" />
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope="col">Moeda</th>
            <th scope="col">Valor mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Volume</th>
            <th scope="col">Mudança 24h</th>
          </tr>
        </thead>

        <tbody id="tbody">
          {coins.length > 0 &&
            coins.map((item) => (
              <tr className={styles.tr} key={item.id}>

                <td className={styles.tdlabel} data-label="Moeda">
                  <div className={styles.name}>
                    <img
                    className={styles.logo} 
                     src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`} 
                     alt="Logo da moeda" 
                     />
                    <Link to={`/detail/${item.id}`}>
                      <span>{item.name}</span> | {item.symbol}
                    </Link>
                  </div>
                </td>

                <td className={styles.tdlabel} data-label="Valor mercado">
                  {item.formatedMarket}
                </td>

                <td className={styles.tdlabel} data-label="Preço">
                  {item.formatedPrice}
                </td>

                <td className={styles.tdlabel} data-label="Volume">
                    {item.formatedVolume}
                </td>

                <td className={Number(item.changePercent24Hr)> 0 ? styles.tdProfit : styles.tdLoss} data-label="Mudança 24h">
                  <span>{Number(item.changePercent24Hr).toFixed(2)}</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <button className={styles.buttonMore} onClick={handleGetMore}>
        Carregar mais
      </button>
    </main>
  );
}
