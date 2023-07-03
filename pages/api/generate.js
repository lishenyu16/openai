import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
	if (!configuration.apiKey) {
		res.status(500).json({
			error: {
				message: "OpenAI API key not configured, please follow instructions in README.md",
			}
		});
		return;
	}

	const animal = req.body.animal || '';
	if (animal.trim().length === 0) {
		res.status(400).json({
			error: {
				message: "Please enter a valid animal",
			}
		});
		return;
	}

	try {
		// response = openai.Completion.create(
		// 	model="text-davinci-003",
		// 	prompt="Create a list of 8 questions for my interview with a front end web developer:",
		// 	temperature=0.5,
		// 	max_tokens=150,
		// 	top_p=1.0,
		// 	frequency_penalty=0.0,
		// 	presence_penalty=0.0
		// )

		const completion = await openai.createCompletion({
			// model: "text-davinci-003",
			// prompt: generatePrompt(animal),
			// temperature: 0.6,
			model: "text-davinci-003",
			prompt: "Create a list of 20 questions for my interview with " + `${animal} and answers respectively`,
			temperature: 0.5,
			max_tokens: 150,
			top_p: 1.0,
			frequency_penalty: 0.0,
			presence_penalty: 0.0
		});
		res.status(200).json({ result: completion.data.choices[0].text });
	} catch (error) {
		// Consider adjusting the error handling logic for your use case
		if (error.response) {
			console.error(error.response.status, error.response.data);
			res.status(error.response.status).json(error.response.data);
		} else {
			console.error(`Error with OpenAI API request: ${error.message}`);
			res.status(500).json({
				error: {
					message: 'An error occurred during your request.',
				}
			});
		}
	}
}

function generatePrompt(animal) {
	const capitalizedAnimal =
		animal[0].toUpperCase() + animal.slice(1).toLowerCase();
	return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}
