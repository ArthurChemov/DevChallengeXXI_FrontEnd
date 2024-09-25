# DevChallengeXXI_FrontEnd
<strong>Description</strong>

<a href="https://mfa.gov.ua/en">Ministry of Foreign Affairs of Ukraine</a> (MFA of Ukraine) is a central executive body whose activities are directed and coordinated by the Cabinet of Ministers of Ukraine. The MFA of Ukraine is the main body in the system of central executive authorities in formulating and ensuring the implementation of the state policy in the field of foreign relations of Ukraine.

<div><b>Your task.</b></div>
Development of a web or desktop tool that will allow users with minimal technical skills to quickly and easily visualize various types of data. The product should provide the ability to upload data (tables, CSV, Excel, JSON files, and manual data entry into a field), select the type of visualization (graphs, charts, tables, etc.), and configure the main visualization parameters (colors, axes, titles) through an intuitive interface.
The tool should be as easy to use as possible, without the need for deep technical knowledge. The product should be adaptive to different screens and have integrations or the ability to export data to common formats (PDF, PNG, SVG) and print to a printer.
<div><strong>Files with test data are available at </strong><a href="https://drive.google.com/drive/folders/1tCZEtxtfpJVWvej9evyiRJpnc6HAOTow?usp=drive_link">the link</a><strong>.</strong></div>

<br><br><br><br>
<h1>Basic functional requirements</h1><div>
<br><strong>1. Interface</strong>:</div><ul>
<li>Create a simple, intuitive user interface.</li>
<li>The visual style should be based on the MFA website: <a href="https://mfa.gov.ua/">https://mfa.gov.ua/</a>
</li>
<li>Provide a clear structure where users can quickly find the options they need (uploading files, choosing a graph type, settings).</li>
<li>A detailed description of the interface elements is given below</li>
</ul><div><br></div><div>
<strong>2. Data upload</strong>:</div><ul>
<li>The tool should support uploading data in CSV, Excel, JSON formats, manual data entry into the input field.</li>
<li>Support for drag and drop of files.</li>
<li>Ability to preview the uploaded data in a tabular format before building a visualization.</li>
<li>Resistance to errors and unforeseen situations (incorrect data, empty files, etc.).</li>
<li>Test data can be found <a href="https://drive.google.com/drive/folders/1tCZEtxtfpJVWvej9evyiRJpnc6HAOTow?usp=sharing">at the link</a>.</li>
</ul><div>
<br><strong>3. Selecting the type of visualization:</strong>
</div><ul>
<li>The tool should provide the ability to create at least 3 types of visualizations: line graph, bar chart, pie chart.</li>
<li>Add a simple mechanism for selecting the type of visualization (e.g. drop-down menu or buttons).</li>
<li>HTML, SVG, and CANVAS can be used to display graphs.</li>
</ul><div>
<br><strong>4. Customize charts</strong>:</div><ul>
<li>Provide users with the ability to customize basic graph settings: colors, axis names, titles, line styles.</li>
<li>The interface for changing the color palette of the graph should be interactive and user-friendly (e.g. color selection through a palette).</li>
<li>The graph should be able to be animated.</li>
<li>Graph scales should be calculated using extreme values.</li>
<li>The legend should be placed inside the graph, but not interfere with the main data.</li>
</ul><div>
<br><strong>5. Adaptability</strong>:</div><ul><li>The application should work correctly on all devices: desktops, tablets, and mobile phones. Ensure smooth adaptation of the interface to different screens.</li></ul><div>
<br><strong>6. Export of visualizations</strong>:</div><ul>
<li>Implement the ability to export ready-made visualizations to PNG, PDF, and SVG formats.</li>
<li>Add functionality to save charts as separate images (download button).</li>
<li>Print to printer (print only the graph, without the interface and unnecessary elements).</li>
</ul><div>
<br><strong>7. Documentation/Interactive tips</strong>:</div><ul><li>Add short interactive instructions or tips to help users understand how to use the tool.</li></ul><div>
<br><strong>8. Application performance</strong>.</div><ul>
<li>The speed of loading and processing large amounts of data.</li>
<li>The application works without delays. </li>
<li>Smooth animations.</li>
</ul><div><br></div><div><br></div><div><br></div><div><br></div><h1>Basic interface requirements</h1><div><br></div><ol>
<li>
<strong>Main Section.</strong><br>a. <strong>Header</strong>:<br>  • The name of the instrument.<br>  • Icon for settings or switching the theme (light/dark).<br>b. <strong>File Upload Area</strong>:<br>  • Create a large area with the text ‘Drag &amp; Drop area’.<br>  • Add a ‘Choose File’ button for those who don't use the drag and drop feature.<br>  • Support for file formats (CSV, Excel, JSON) should be indicated below the upload area.<br>  • Field for manual data entry<br>c. <strong>Chart Type Selection</strong>:<br>  • Add a drop-down menu or buttons to select the type of visualization: line chart, bar chart, pie chart.<br>d. <strong>Generate Chart Button</strong>:<br>  • The Generate Chart Button should be highlighted and located next to the file upload options.<br><br>
</li>
<li>
<strong>Visualization Section.<br></strong>a. <strong>Chart Area</strong>:<br>  • The central part of the screen is reserved for displaying the chart.<br>  • The chart should occupy the maximum space on the screen so that the user can see it clearly.<br>b. <strong>Customization Panel</strong>:<br>  • The panel should allow you to configure the following parameters: <br>    1) Graph title.<br>    2) Captions for the X and Y axes.<br>    3) Selecting colors for graph elements (using the color palette).<br>  • Select the line style (for line graphs) or column thickness (for bar graphs).<br>c. <strong>Reset button to reload the files.<br></strong><br>
</li>
<li>
<strong>Export Section</strong>.<br>a. Export Buttons:<br>  • Add buttons to export your visualization in PNG, PDF, SVG formats.<br>  • Print button - print the graph on the printer. <br>   1) Important: the cmd (Ctrl) + p combination should also print the adapted page.<br>  • The buttons should be available after the graph is generated.<br><br>
</li>
<li>
<strong>Responsiveness</strong>.<br>a. Mobile version:<br>  • The interface should adapt to the screen of mobile devices (the settings menu and chart types can be hidden behind the hamburger button or at your discretion). Charts should scroll horizontally if the screen width is not enough<br>b. Tablet:<br>  • The interface should work as well on tablets as it does on desktops, with the ability to use touch elements.<br><br>
</li>
<li>
<strong>Documentation or Tooltips</strong>.<br>a. Include interactive tooltips or a quick start guide on the home screen so that users can quickly find their way around.<br><br>
</li>
<li>
<strong>Additional.<br></strong>a. Three-dimensional graph<br>  • The user can display data in 3-dimensional space<br>b. Dark/Light Theme<br>  • Add the ability to switch between light and dark themes. Use modern approaches to contrast to ensure that the interface remains comfortable in dark lighting conditions.<br>c. Interactive Elements<br>  • Graphs should be interactive: add the ability to zoom in/out and navigate.<br>  • Tooltips for each visualization element should appear when hovering over parts of the graph.</li>
</ol><div>
<br><br><br>
</div><h1>Additional tasks (bonus points)</h1><div>
<br>1. <strong>3d graph. Ability to build a three-dimensional graph.<br><br></strong>2. <strong>Interactivity of graphs:</strong>
</div><ul>
<li>Implement zooming and navigation on graphs (zoom in/out, drag to pan).</li>
<li>Add the ability to filter data directly on the graph (e.g., filtering by specific categories).</li>
</ul><div><br></div><div>3.<strong> Dark/light theme:</strong>
</div><ul><li>Implement the ability to switch between a dark and a light interface theme.</li></ul><div>
<br>4.<strong> Web accessibility – compliance with WCAG standards.</strong>
</div><div>
<br><br><br>
</div><h1>Colours and other UI elements</h1><div><br></div><ol>
<li>
<strong>Primary Colors</strong><br>a. <strong>Primary Blue</strong>: it is the main colour that symbolises formality and authority.<br>HEX: #003366<br>RGB: (0, 51, 102)<br>b. <strong>Secondary Blue</strong>: for accents and background elements.<br>HEX: #0056A2<br>RGB: (0, 86, 162)<br>c. <strong>White</strong>: used for backgrounds and text on dark backgrounds.<br>HEX: #FFFFFF<br>RGB: (255, 255, 255)<br>d. <strong>Gray for Backgrounds</strong>: it is used as a background for secondary elements, text entry areas, etc.<br>HEX: #F1F1F1<br>RGB: (241, 241, 241)<br>e. <strong>Black</strong>: for the main text.<br>HEX: #000000<br>RGB: (0, 0, 0)<br><br>
</li>
<li>
<strong>Accent Colors</strong><br>a. <strong>Golden Accent</strong>: for accents and decorative elements.<br>HEX: #FFD700<br>RGB: (255, 215, 0)<br>b. <strong>Error Red</strong>: for reporting errors or critical items.<br>HEX: #D32F2F<br>RGB: (211, 47, 47)<br><br>
</li>
<li>
<strong>Typography</strong><br>a. <strong>Font</strong>: Use classic sans-serif fonts such as Arial, Roboto, or Open Sans that are easy to read and match the official style.<br>b. <strong>Headings</strong>:<br>Font Size: 24px, Bold<br>Line Height: 32px<br>Color: #003366 (Primary Blue)<br>c. <strong>Body Text</strong>:<br>Font Size: 16px, Regular<br>Line Height: 24px<br>Color: #000000 (Black)<br>d. <strong>Labels and Small Text</strong>:<br>Font Size: 12px, Regular<br>Line Height: 16px<br>Color: #0056A2 (Secondary Blue)<br><br>
</li>
<li>
<strong>Button Style</strong><br>a. <strong>Primary Button</strong>:<br>Background Color: #003366 (Primary Blue)<br>Text Color: #FFFFFF (White)<br>Border Radius: 0<br>Padding: 12px 24px<br>Hover: Slightly darker blue, for example, #00284D<br>b. <strong>Secondary Button</strong>:<br>Background Color: #FFD700 (Golden Accent)<br>Text Color: #000000 (Black)<br>Border Radius: 0<br>Padding: 12px 24px<br>Hover: Slightly darker Golden Accent<br>c. <strong>Error Button</strong>:<br>Background Color: #D32F2F (Error Red)<br>Text Color: #FFFFFF (White)<br>Hover: Slightly darker Error Red<br><br>
</li>
<li>
<strong>Chart Style<br></strong>a. You can choose from the following color palettes, or those of your choice <action-text-attachment content-type="image" url="https://lh7-rt.googleusercontent.com/docsz/AD_4nXcAJXHO9TmwHP3PgQYLgJLfuHI627oUafS5FJcM6LgL73xbouvKkclpz139WvvEgNEpWmhRadc3132eANjOXGAoj_B1RW3yn5qfCpo0jQp9jwiUYA-iOqr1kd-nen2_z4MEm6U4ok6ejvsc7BjEXacKVWs?key=IAMAUl4Mx8LSEMSnL9SBPg" width="570" height="94"><figure class="attachment attachment--preview">
  <img width="570" height="94" src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXcAJXHO9TmwHP3PgQYLgJLfuHI627oUafS5FJcM6LgL73xbouvKkclpz139WvvEgNEpWmhRadc3132eANjOXGAoj_B1RW3yn5qfCpo0jQp9jwiUYA-iOqr1kd-nen2_z4MEm6U4ok6ejvsc7BjEXacKVWs?key=IAMAUl4Mx8LSEMSnL9SBPg">
</figure></action-text-attachment><br>b. Palette 1 (Inspired by MFA color scheme):<br>HEX: #003366, RGB: (0, 51, 102)<br>HEX: #0056A2, RGB: (0, 86, 162)<br>HEX: #FFD700, RGB: (255, 215, 0)<br>HEX: #F1F1F1, RGB: (241, 241, 241)<br> HEX: #D32F2F, RGB: (211, 47, 47)<br><br>c. Palette 2 (Classic contrasting colors):<br> HEX: #1F77B4, RGB: (31, 119, 180)<br> HEX: #FF7F0E, RGB: (255, 127, 14)<br> HEX: #2CA02C, RGB: (44, 160, 44)<br> HEX: #D62728, RGB: (214, 39, 40)<br> HEX: #9467BD, RGB: (148, 103, 189)<br><br>d. Palette 3 (Balanced cool and warm tones):<br> HEX: #4E79A7, RGB: (78, 121, 167)<br> HEX: #F28E2B, RGB: (242, 142, 43)<br> HEX: #E15759, RGB: (225, 87, 89)<br> HEX: #76B7B2, RGB: (118, 183, 178)<br> HEX: #59A14F, RGB: (89, 161, 79)<br><br>e. Palette 4 (Vibrant and modern):<br> HEX: #8E44AD, RGB: (142, 68, 173)<br> HEX: #3498DB, RGB: (52, 152, 219)<br> HEX: #E74C3C, RGB: (231, 76, 60)<br> HEX: #F1C40F, RGB: (241, 196, 15)<br> HEX: #2ECC71, RGB: (46, 204, 113)<br><br>f. Palette 5 (Bold and dynamic colors):<br> HEX: #6A4C93, RGB: (106, 76, 147)<br>HEX: #1982C4, RGB: (25, 130, 196)<br> HEX: #8AC926, RGB: (138, 201, 38)<br> HEX: #FFCA3A, RGB: (255, 202, 58)<br> HEX: #FF595E, RGB: (255, 89, 94)<br><br>
</li>
<li>
<strong>Icons and Visual Elements<br></strong>a. Icons can only be used from the <a href="https://fonts.google.com/icons">Material Icons</a> library.<br>b. Use icons only where necessary to maintain a clean and simple interface.<br><br>
</li>
<li>
<strong>Dark</strong> <strong>Mode<br></strong>a. Background: #121212 (Dark Gray).<br>b. Text: #FFFFFF (White).<br>c. Buttons: Blue or gold for the main elements on a dark background.</li>
</ol>
