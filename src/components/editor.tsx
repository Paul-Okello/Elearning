"use client";

import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import "react-quill-new/dist/quill.snow.css";

type Props = {
	onChange: (value: string) => void;
	value: string;
};

const Editor = (props: Props) => {
	const ReactQuill = useMemo(
		() =>
			dynamic(() => import("react-quill-new"), {
				ssr: false,
			}),
		[],
	);
	return (
		<ReactQuill
			className="rounded-quill"
			value={props.value}
			onChange={props.onChange}
			theme="snow"
		/>
	);
};

export default Editor;