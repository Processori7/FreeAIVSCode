# Description
This is an extension that allows you to conveniently use free AI services in you VS Code sidebar.  

# Features  
## The settings menu is located in the upper right corner and opens when you click on "⚙️".
The following functions are available in this menu:  
- The "Open sites in a new browser tab" checkbox - when active, opens links in a new tab by left-clicking on the desired item from the list.  
- "Add to Favorites" checkbox - when active, adds the selected item to the favorites list. This way, the selected items will always be above the other items in the list, but they will remain in their sections.  
- The "Open website in a new browser tab by right-clicking" checkbox - when active, opens the selected item in a new tab by right-clicking on it.  
- The "Copy link when right-clicking" checkbox - when active, copies the link to the selected item when right-clicking on it.  
- New Year's Theme checkbox - adds various Christmas elements and decorations when active.  
- Search - allows you to find the desired item in the list not only by the name of the service, but also by its description.  
- Checkbox "Hide services that cannot be opened in the sidebar" - allows you to immediately hide services that cannot be opened in the sidebar, while the search works on all elements, regardless of whether they are hidden or not.  
- The settings menu now shows the total number of free services  

## Middle-click copy
Middle-click (scroll wheel) on any service copies its URL to clipboard. Green flash confirms the copy.

## Smart iframe detection
Known unframable sites (ChatGPT, Gemini, Claude, Poe, etc.) are automatically detected and hidden when "Show only services that can be opened in side panel" is active. Search still works on all items regardless of visibility.

## Section Menu  
This menu is located in the center on the right side, and opens when you press the "📑" button.  
The purpose of this menu is to provide quick navigation through sections. To do this, simply click on the desired section with the left mouse button, after which scrolling to it will automatically begin.  

## Design menu  
This menu is located in the center on the right side, below the section menu and opens when you click on the "🎨" button.  
This menu allows you to fully customize the design of the extension for yourself, namely:  
- Background color  
- Text color  
- The color of the headlines
- Background color of the elements  
- The color of the text of the elements

## Installation & Usage

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/Processori7/Free_AI_VSCode.git
   cd Free_AI_VSCode
   npm install
   ```
2. Build a VSIX package and install it:
   ```bash
   npx vsce package          # creates Free_AI_VSCode-<version>.vsix
   code --install-extension Free_AI_VSCode-VERSION.vsix
   ```
   – or –
   open the project folder in VS Code, then go to the extension store, click on the three dots in the upper-right corner and select "Install From VSIX". The extension icon should appear in the sidebar next to the extension store or below if other extensions are already installed.

### Update
Run in the extension directory:
```bash
git pull
npm install
npx vsce package && code --install-extension Free_AI_VSCode-*.vsix
```

If you're using Git, go to the directory with the extension and run:
```
git pull
```
Or download the archive and copy the replacement files. Or check update in VSCode store.

# Thanks  
Thank you for your help with the layout and design of [ShikoDay](https://github.com/ShikoDay) :)  

# Описание 
Это расширение, которое позволяет удобно пользоваться бесплатными сервисами ИИ в боковой панели VS Code.  

# Возможности  
## Меню настроек находиться в правом верхнем углу и открывается при нажатии на "⚙️".
В данном меню доступны следующие функции:  
- Чекбокс "Открывать сайты в новой вкладке браузера" - при активном состоянии открывает ссылки в новой вкладке при нажатии левой кнопки мыши на нужный элемент из списка.  
- Чекбокс "Добавить в избранное" - при активном состоянии добавляет выбранный элемент в список избранных. Таким образом, выбранные элементы будут всегда находиться выше других элементов в списке, но при этом будут оставаться в своих секциях.  
- Чекбокс "Открывать сайт в новой вкладке браузера при нажатии правой кнопкой мыши" - при активном состоянии открывает выбранный элемент в новой вкладке браузера при нажатии правой кнопкой мыши на нем.  
- Чекбокс "Копировать ссылку при нажатии правой кнопкой мыши" - при активном состоянии копирует ссылку на выбранный элемент при нажатии правой кнопкой мыши по нему.  
- Чекбокс "Новогодняя тема" - при активном состоянии добавляет различные новогодние элементы и украшения.  
- Поиск - позволяет находить нужный элемент в списке не только по названию сервиса, но и по его описанию.  
- Чекбокс "Скрыть сервисы, которые не могут быть открыты в боковой панели" - позволяет сразу скрыть сервисы, которые не могут быть открыты в боковой панели, при этом поиск работает по всем элементам, независимо от того, скрыты они или нет.  
- Теперь в меню настроек показывается общее количество бесплатных сервисов  

## Копирование средним кликом
Средняя кнопка мыши (колёсико) по любому сервису копирует его URL в буфер обмена. Зелёная вспышка подтверждает копирование.

## Умное определение фреймов
Известные несовместимые сайты (ChatGPT, Gemini, Claude, Poe и др.) автоматически определяются и скрываются при включении чекбокса "Показать только сервисы, доступные в боковой панели". Поиск работает по всем элементам независимо от видимости.

## Меню разделов  
Данное меню находиться по центру с правой стороны, и открывается при нажатии на кнопку "📑".  
Цель этого меню - обеспечить быстрое перемещение по разделам. Для этого нужно просто нажать на нужный раздел левой кнопкой мыши, после чего автоматически начнется прокрутка к нему.  

## Меню оформления  
Данное меню находиться по центру с правой стороны, ниже меню разделов и открывается при нажатии на кнопку "🎨".  
Данное меню позволяет полностью настраивать оформление расширения под себя, а именно:  
- Цвет фона  
- Цвет текста  
- Цвет заголовков
- Цвет фона элементов  
- Цвет текста элементов  

## Установка и использование (RU)

1. Клонируйте репозиторий и установите зависимости:
   ```bash
   git clone https://github.com/Processori7/Free_AI_VSCode.git
   cd Free_AI_VSCode
   npm install
   ```
2. Соберите пакет VSIX и установите его:
   ```bash
   npx vsce package          # создаст файл Free_AI_VSCode-<version>.vsix
   code --install-extension Free_AI_VSCode-VERSION.vsix
   ```
   – или –
   откройте папку проекта в VS Code, затем перейдите в магазин расширений, нажмите на три точки в верхнем правом углу и выбирите "Install From VSIX". Иконка расширения должна будет появиться на боковой панели рядом с магазином расширений или ниже, если уже установлены другие расширения.

### Обновление
В каталоге расширения выполните:
```bash
git pull
npm install
npx vsce package && code --install-extension Free_AI_VSCode-*.vsix
```

Если вы используете Git перейдите в каталог с расширением и выполните:
```
git pull
```
Или скачайте архив и копируйте файлы с заменой. Также можете проверить наличие обновлений для расширения в магазине VSCode.

# Благодарности  
Благодарю за помощь с вёрсткой и дизайном [ShikoDay](https://github.com/ShikoDay) :)