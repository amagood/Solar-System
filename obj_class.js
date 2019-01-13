class obj_buffer_tex
{
  constructor(program) 
  {
    this.VertexPosition_Buffer = null;
    this.VertexNormal_Buffer = null;
    this.VertexTextureCoordinate_Buffer = null;
    //this.IndicesBuffer = null;
    //this.IndicesLen = 0;
    this.Texture_Buffer = null;
    this.material_shininess = -1;
    this.material_Ambient = vec4( 0,0,0,0 );
    this.material_Diffuse = vec4( 0,0,0,0 );
    this.material_Specular = vec4( 0,0,0,0 );
    this.vPosition = gl.getAttribLocation( program, "vPosition" );
    this.vColor = gl.getAttribLocation( program, "vColor" );
    this.vNormal = gl.getAttribLocation( program, "vNormal" );
    this.vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    //this.tex_loc = gl.getUniformLocation(program, "texture")
    //this.image = new Image();
  }
  the_buffer_stuff(obj,program)
  {
    this.VertexPosition_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPosition_Buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // color array atrribute buffer
    
    this.VertexColor_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexColor_Buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.colorsArray), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    // normal array atrribute buffer

    this.VertexNormal_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexNormal_Buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.normalsArray), gl.STATIC_DRAW);
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    this.VertexTextureCoordinate_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexTextureCoordinate_Buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.texcoords), gl.STATIC_DRAW);
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(testObject1.vertexTextureCoords), gl.STATIC_DRAW );


    this.Texture_Buffer = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.Texture_Buffer);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    //gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);

    
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

  }
  the_buffer(obj,program,pic_name)
  {
    this.VertexPosition_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPosition_Buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.pointsArray), gl.STATIC_DRAW);
    // color array atrribute buffer
    
    this.VertexColor_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexColor_Buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.colorsArray), gl.STATIC_DRAW);
    // normal array atrribute buffer

    this.VertexNormal_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexNormal_Buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.normalsArray), gl.STATIC_DRAW);

    //

    
    this.VertexTextureCoordinate_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexTextureCoordinate_Buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.texcoords), gl.STATIC_DRAW);
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(testObject1.vertexTextureCoords), gl.STATIC_DRAW );

  }
  the_attribute(program)
  {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPosition_Buffer);
    //this.vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( this.vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( this.vPosition );

    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexColor_Buffer);
    //this.vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( this.vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( this.vColor );

    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexNormal_Buffer);
    //this.vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( this.vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( this.vNormal );

    gl.bindTexture(gl.TEXTURE_2D, this.Texture_Buffer);
    //gl.uniform1i(this.tex_loc, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexTextureCoordinate_Buffer);
    //this.vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( this.vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( this.vTexCoord );
  }

  TEXture(image) 
  {
    this.Texture_Buffer = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.Texture_Buffer);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    //gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    //gl.uniform1i(this.tex_loc, 0);

  }
}

