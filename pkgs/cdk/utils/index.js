const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

// DynamoDBクライアントの作成
const client = new DynamoDBClient({
	region: process.env.CDK_DEFAULT_REGION,
});

// DynamoDBテーブル名の定義
const carsTableName = "cardata-cars";
const defectsTableName = "cardata-defects";

// JSONファイルから車のデータを読み込む
const carsData = require("../data/cars.json");
const defectsData = require("../data/defects.json");

// 車オブジェクトをDynamoDBのPutItemInput形式に変換する関数
const convertToPutItemInput = (table, prop) => {
	return {
		TableName: table,
		Item: prop,
	};
};

// 遅延を入れてPutItemCommandを実行する関数
const executeWithDelay = async (command) => {
	return new Promise((resolve) => {
		setTimeout(async () => {
			// DynamoDBにデータを送信
			await client.send(command);
			resolve();
		}, 250); // 各実行の間に250ミリ秒の遅延を入れる
	});
};

// 車データを処理する関数
const processCarsData = async () => {
	for (let i = 0; i < carsData.length; i++) {
		console.log(
			`[${i + 1}/${carsData.length + 1}] - 車のデータをDynamoDBに送信中... ナンバープレート: ${carsData[i].licenseplate.S}`,
		);
		// 車オブジェクトをPutItemInput形式に変換
		const input = convertToPutItemInput(carsTableName, carsData[i]);
		// PutItemCommandの作成
		const command = new PutItemCommand(input);
		// 実行
		await executeWithDelay(command);
	}
};

// 不具合データを処理する関数
const processDefectsData = async () => {
	for (let i = 0; i < defectsData.length; i++) {
		console.log(
			`[${i + 1}/${defectsData.length + 1}] - 不具合データをDynamoDBに送信中... ナンバープレート: ${defectsData[i].licenseplate.S}`,
		);
		// 不具合オブジェクトをPutItemInput形式に変換
		const input = convertToPutItemInput(defectsTableName, defectsData[i]);
		// PutItemCommandの作成
		const command = new PutItemCommand(input);
		// 実行
		await executeWithDelay(command);
	}
};

// 処理を実行する
processCarsData()
	.then(() =>
		console.log("車のデータがDynamoDBに送信されました（速度: 4レコード/秒）。"),
	)
	.catch((err) => console.error("エラー:", err));

processDefectsData()
	.then(() =>
		console.log(
			"不具合データがDynamoDBに送信されました（速度: 4レコード/秒）。",
		),
	)
	.catch((err) => console.error("エラー:", err));
