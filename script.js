// Buscar clima na API
async function fetchWeather() {
    const apiKey = "dace5bbabc8a126130b6b5eeea435fc5"; // Pegue no OpenWeather
    const city = "Guarulhos"; // Ou use geolocalização
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      const temp = Math.round(data.main.temp);
      const desc = data.weather[0].description;
      document.getElementById("footer-APIclima").innerText = `🌡️ ${temp}°C - ${desc}`;
    } catch (error) {
      document.getElementById("footer-APIclima").innerText = "⚠️ Erro ao carregar clima";
    }
  }

// Atualiza o clima a cada 5 minutos (300000 ms)
setInterval(fetchWeather, 300000);

fetchWeather();

// Puxar dados da API e validar apenas pelo dia da semana e período correto
async function carregarDados() {
    try {
      const response = await fetch("dados.json", { //"https://api.zerosheets.com/v1/ucb"
        method: "GET",
        headers: {
           Authorization: "Bearer TmE0AUNkzYsdTPb1Zntc5yyyh1vDd04V"
      }
     });

     const dados = await response.json();

     // Obter o dia da semana atual
     const diasSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
     const hoje = new Date().getDay();
     const diaAtualAbreviado = diasSemana[hoje];
     const diaAtualCompleto = getDiaCompleto(diaAtualAbreviado);
 
     // Obter o período atual
     const periodoAtual = definirPeriodo(new Date());
     const siglaPeriodo = obterSiglaPeriodo(periodoAtual);
     console.log(`Hoje é: ${diaAtualAbreviado} (${diaAtualCompleto}), Período: ${periodoAtual} (${siglaPeriodo})`);

     // Filtrar os dados pelo dia e período
    const dadosFiltrados = dados.filter(item => {
    const diaAbreviado = item.DIA ? item.DIA.trim().toUpperCase() : "";
    const diaCompleto = item["DIA DA SEMANA"] ? item["DIA DA SEMANA"].trim().toUpperCase() : "";
    const periodo = item.PERIODO ? item.PERIODO.trim().toUpperCase() : "";
  
    return (diaAbreviado === diaAtualAbreviado || diaCompleto === diaAtualCompleto) && periodo === siglaPeriodo;
    });

    console.log("Dados filtrados:", dadosFiltrados);

    // Atualizar tabela
    const corBolinha = {
    "PRESENCIAL": "green",
    "EAD SEMIPRESENCIAL": "red",
    "CALOUROS": "orange"
  };
  
    const corPeriodo = {
    "M": "green",
    "V": "yellow", // Adicione cores para outros períodos se necessário
    "N": "blue"
  };

  // Atualizar tabela
const tbody = document.querySelector("#iDmainTabela tbody");
tbody.innerHTML = "";

dadosFiltrados.forEach(item => {
  const cor = corBolinha[item.MODALIDADE] || "gray"; // Cor padrão se não estiver definida
  const fundo = corPeriodo[item.PERIODO] || "gray";
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td class="main-tabela-coluna">
      <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:${cor}; margin-right:5px;"></span>
      ${item.MODALIDADE}
    </td>
    <td><strong>${item.DISCIPLINA}</strong></td>
    <td>${item.PROFESSOR}</td>
    <td><span style="width:10px"></span><strong>${item.AMBIENTE}</strong></td>
  `;
  tbody.appendChild(tr);
});

} catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
}

// Mapeia os dias da semana completos
function getDiaCompleto(abreviacao) {
  const mapaDias = {
    "DOM": "DOMINGO",
    "SEG": "SEGUNDA-FEIRA",
    "TER": "TERÇA-FEIRA",
    "QUA": "QUARTA-FEIRA",
    "QUI": "QUINTA-FEIRA",
    "SEX": "SEXTA-FEIRA",
    "SÁB": "SÁBADO"
  };
  return mapaDias[abreviacao] || "";
}

// Função para determinar o período do dia
function definirPeriodo(now) {
    const hora = now.getHours();
    const minutos = now.getMinutes();
    const horarioDecimal = hora + minutos / 60; // Converte para formato decimal
  
    if (horarioDecimal >= 6 && horarioDecimal < 14) {
      return "Matutino"; // Entre 6:00 e 13:59
    } else if (horarioDecimal >= 14 && horarioDecimal < 16.5) {
      return "Vespertino"; // Entre 14:00 e 17:29
    } else if (horarioDecimal >= 16.5 && horarioDecimal <= 22) {
      return "Noturno"; // Entre 17:30 e 22:00
    } else {
      return "Fora do horário de aulas"; // Qualquer outro horário
    }
  }

  // Converte o nome do período para a sigla usada no JSON
function obterSiglaPeriodo(periodoNome) {
    const mapa = {
      "Matutino": "M",
      "Vespertino": "V",
      "Noturno": "N"
    };
    return mapa[periodoNome] || "";
  }

  function updateDateTime() {
    const now = new Date();
    const dateString = now.toLocaleDateString("pt-BR"); // Formato da data: 14/03/2025
    const diaSemana = now.toLocaleDateString("pt-BR", { weekday: "long" }); // Dia da semana completo
    const timeString = now.toLocaleTimeString("pt-BR", {
      timeStyle: "short",
    });

    const periodoAtual = definirPeriodo(now);
    document.getElementById("iDheader-dataAtual").innerText = ` ${dateString}`; // Mostra apenas a data
    document.getElementById("footer-controlePeriodos").innerText = ` ${periodoAtual}`; //mostra o periodo de acordo com a hora
    document.getElementById("iDheader-dataSemana").innerText = `${diaSemana}`; // Mostra o dia da semana
  
    // Atualiza a tabela com os dados filtrados para o novo período
    carregarDados();
  }
  // Atualiza a cada 1 minuto
  setInterval(updateDateTime, 60000);
  updateDateTime();