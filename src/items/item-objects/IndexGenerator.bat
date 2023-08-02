@echo off
REM For windows, and only necessary when new items are added
REM This generates the index.ts file; run it in a command window opened to the containing folder to generate


echo // generated with IndexGenerator.bat > index.ts
(
	for %%f in (.\*.ts) do (
		if not %%~nf == index (
			echo export * from './%%~nf';
		)
	)
) >> index.ts