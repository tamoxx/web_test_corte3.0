from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/api/teste")
def teste():
    return jsonify({
        "mensagem": "Black Barber 3.0 conectado ao Python!"
    })


@app.route("/api/agendamentos", methods=["POST"])
def criar_agendamento():
    dados = request.get_json()

    print("\n--- NOVO AGENDAMENTO ---")
    print(f"Nome: {dados.get('name')}")
    print(f"WhatsApp: {dados.get('phone')}")
    print(f"Serviço: {dados.get('service')}")
    print(f"Barbeiro: {dados.get('barber')}")
    print(f"Data: {dados.get('date')}")
    print(f"Horário: {dados.get('time')}")
    print(f"Observações: {dados.get('notes')}")
    print("------------------------\n")

    return jsonify({
        "sucesso": True,
        "mensagem": "Agendamento recebido pelo Python!"
    })


if __name__ == "__main__":
    app.run(debug=True)