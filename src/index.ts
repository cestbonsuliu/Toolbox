import joplin from 'api';
import { deepStrictEqual } from 'assert';


joplin.plugins.register({

	onStart: async function () {

		await joplin.commands.register({
			name: 'codeBlock',
			label: 'Code Block',
			iconName: 'fas fa-bars',
			execute: async () => {

				let note = await joplin.workspace.selectedNote();


				// 这里要注意:如果当前未选择笔记则note可以为Null
				if (note) {
					console.info('Note content has changed! New note is:', note);
				} else {
					console.info('No note is selected');
				}

				let code = note.body;

				console.info(code);

				//获取代码块
				let reg = /```([\s\S]*?)```/g;
				let re1 = code.match(reg);
				console.info("所有的代码块:");
				console.info(re1);


				//获取正常内容
				let reg2 = /`([\s\S]*)`/;
				let re2;
				let i;

				if (re1 != null) {
					for (i = 0; i < re1.length; i++) {

						console.info("第" + (i + 1) + "个代码块:" + re1[i]);
						re1[i] = re1[i].replace("```", "");
						re1[i] = re1[i].replace("```", "");
						console.info("第" + (i + 1) + "个代码块去```后:" + re1[i]);

						re2 = reg2.exec("" + re1[i]);
						if (re2 != null) {
							re2[1] = "\n" + re2[1] + "\n";
							console.info("第" + (i + 1) + "个正常内容:" + re2[1]);

							//将正常内容覆盖源代码块内容		
							code = code.replace("" + re1[i], re2[1]);
							console.info(code);
						} else {
							console.info("是正常的代码块");
						}


					}
					await joplin.data.put(['notes', note.id], null, { body: code });

				} else {
					console.info("没有代码块!")
				}

			},
		});

		await joplin.commands.register({
			name: 'insertCodeBlock',
			label: 'Insert code block',
			execute: async () => {
				await joplin.clipboard.writeText('```  \n\n```')
			},
		});



		await joplin.views.menus.create('codeMenu', 'codeBlock', [
			{
				label: 'codeBlock',
				commandName: 'codeBlock',
				accelerator: 'Ctrl+Alt+Shift+B',
			},
		]);

		

	},


});