import db from "../models";

const Finances = db.finances;

const createBalance = async (req, res) => {
  try {
    const data = req.body;

    const finance = new Finances({
      description: data.description,
      value: data.value,
      category: data.category,
      year: data.year,
      month: data.month,
      day: data.day,
      yearMonth: data.yearMonth,
      yearMonthDay: data.yearMonthDay,
      type: data.type,
      cpfUser: req.userCpf
    })

    await finance.save();
    res.send({ message: "Balanço criado com sucesso!" })
  } catch (e) {
    res.status(500).send({ message: "Algum erro ocorreu ao criar um balanço! " + e });
  }
};

const updateBalance = async (req, res) => {
  try {
    const data = await Finances.findByIdAndUpdate({ cpfUser: req.userCpf, _id: req.params.id }, req.body, { new: true });
    if (data) {
      res.send({ message: "Balanço editado com sucesso!", data });
    } else {
      res.send({ message: "Balanço não encontrado!" });
    }
  } catch (e) {
    res.status(500).send({ message: "Algum erro ocorreu ao editar um balanço! " + e });
  }
};

const removeBalance = async (req, res) => {
  try {
    const data = await Finances.findByIdAndRemove({ cpfUser: req.userCpf, _id: req.params.id });
    if (data) {
      res.send({ message: "Balanço excluído com sucesso!"});
    } else {
      res.send({ message: "Balanço não encontrado!" });
    }
  } catch (e) {
    res.status(500).send({ message: "Algum erro ocorreu ao excluir balanço! " + e });
  }
};


const getFinances = async (req, res) => {
  try {
    const data = await Finances.find({ cpfUser: req.userCpf });
    res.send(data);
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar os dados " + error });
  }
};

const getOneFinance = async (req, res) => {
  try {
    const data = await Finances.find({ cpfUser: req.userCpf, _id: req.params.id });
    res.send(data);
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar os dados " + error });
  }
};

const getFinancesByMonth = async (req, res) => {
  try {
    const data = await Finances.find({ cpfUser: req.userCpf, yearMonth: req.params.yearMonth }).sort({ day: 1 });
    res.send(data);
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar os dados " + error });
  }
};

const values = async (req, res) => {
  try {
    const data = await Finances.find({ cpfUser: req.userCpf, yearMonth: req.params.yearMonth });

    let count = 0;
    let value = 0;
    let valueExpenses = 0;
    let valueRevenue = 0;

    data.map(item => {
      item.type === "+" ? value = value + item.value : value = value - item.value;
      item.type === "-" ? valueExpenses = valueExpenses + item.value : valueRevenue = valueRevenue + item.value;
      count++;
    });

    res.send({ saldo: "R$ " + value, receita: "R$ " + valueRevenue, despesa: "R$ " + valueExpenses, quantidadeLançamentos: count });
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar os dados " + error});
  }
};

export default {
  createBalance,
  updateBalance,
  getFinances,
  getOneFinance,
  getFinancesByMonth,
  values,
  removeBalance
}
