package com.example.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@Data
@Getter
@Setter
@NoArgsConstructor
@ToString
public class ProfilePhoto {
	 private String name;
	    private String data; // base64 string
	    private String type;
	    private long size;
}
